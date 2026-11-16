import { ConflictException, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type {
  AssignmentMutationResponse,
  CreateAssignmentInput,
  ScheduleQuery,
  ScheduleResponse,
  ShiftAssignment,
  ShiftTemplate,
  UpdateAssignmentInput,
} from '@mono/shared';
import { Between, ILike, Repository } from 'typeorm';
import { EmployeeEntity, ScheduleStateEntity, ShiftAssignmentEntity, ShiftTemplateEntity } from './schedule.entities.js';

@Injectable()
export class ScheduleService implements OnModuleInit {
  constructor(
    @InjectRepository(EmployeeEntity) private readonly employees: Repository<EmployeeEntity>,
    @InjectRepository(ShiftTemplateEntity) private readonly templates: Repository<ShiftTemplateEntity>,
    @InjectRepository(ShiftAssignmentEntity) private readonly assignments: Repository<ShiftAssignmentEntity>,
    @InjectRepository(ScheduleStateEntity) private readonly state: Repository<ScheduleStateEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.employees.count()) === 0) {
      await this.employees.save(
        [
          ['Кузнецова Алина', '#b7947c'], ['Волков Тимур', '#8da5aa'],
          ['Морозова Виктория', '#c7a985'], ['Соколов Артём', '#b7947c'],
          ['Лебедева Полина', '#8da5aa'], ['Новиков Кирилл', '#c7a985'],
        ].map(([fullName, color]) => this.employees.create({ fullName, color, role: 'агент', weeklyHours: 24 })),
      );
    }
    const employeeRoles = new Map([
      ['Кузнецова Алина', 'Старший агент'], ['Волков Тимур', 'Оператор'],
      ['Морозова Виктория', 'Специалист'], ['Соколов Артём', 'Координатор'],
      ['Лебедева Полина', 'Менеджер'], ['Новиков Кирилл', 'Агент'],
    ]);
    const existingEmployees = await this.employees.find();
    const changedEmployees = existingEmployees.filter((employee) => employeeRoles.has(employee.fullName) && employee.role !== employeeRoles.get(employee.fullName));
    if (changedEmployees.length) {
      await this.employees.save(changedEmployees.map((employee) => Object.assign(employee, { role: employeeRoles.get(employee.fullName)! })));
    }
    if ((await this.templates.count()) === 0) {
      await this.templates.save([
        this.templates.create({ name: 'Утро', startTime: '07:00', endTime: '15:00', color: '#9eb0ff' }),
        this.templates.create({ name: 'День', startTime: '10:00', endTime: '18:00', color: '#c89cff' }),
        this.templates.create({ name: 'Вечер', startTime: '15:00', endTime: '23:00', color: '#8edfdc' }),
      ]);
    }
    if (!(await this.state.findOneBy({ id: 'default' }))) {
      await this.state.save({ id: 'default', publishedAt: null });
    }
  }

  async getSchedule(query: ScheduleQuery): Promise<ScheduleResponse> {
    const [employees, templates, assignments, state] = await Promise.all([
      this.employees.find({
        where: query.search ? { fullName: ILike(`%${query.search}%`) } : {},
        order: { fullName: 'ASC' },
      }),
      this.templates.find({ order: { startTime: 'ASC' } }),
      this.assignments.find({ where: { date: Between(query.from, query.to) }, order: { date: 'ASC' } }),
      this.state.findOneBy({ id: 'default' }),
    ]);
    return {
      data: {
        employees,
        templates: templates.map((item) => this.toTemplate(item)),
        assignments: assignments.map((item) => this.toAssignment(item)),
        publishedAt: state?.publishedAt?.toISOString() ?? null,
      },
    };
  }

  async create(input: CreateAssignmentInput): Promise<AssignmentMutationResponse> {
    const template = input.templateId ? await this.templates.findOneBy({ id: input.templateId }) : null;
    if (input.templateId && !template) throw new NotFoundException('Шаблон смены не найден');
    const saved: ShiftAssignmentEntity[] = [];

    for (const { employeeId, date } of input.cells) {
        const existing = await this.assignments.findOneBy({ employeeId, date });
        if (existing) throw new ConflictException('На эту дату сотруднику уже назначена смена');
        const values = {
          employeeId,
          date,
          startTime: template?.startTime ?? input.startTime!,
          endTime: template?.endTime ?? input.endTime!,
          templateId: template?.id ?? null,
          templateName: template?.name ?? 'Своя смена',
          color: template?.color ?? '#9eb0ff',
        };
        const entity = this.assignments.create(values);
        saved.push(await this.assignments.save(entity));
    }
    return { data: saved.map((item) => this.toAssignment(item)) };
  }

  async update(id: string, input: UpdateAssignmentInput): Promise<AssignmentMutationResponse> {
    const assignment = await this.assignments.findOneBy({ id });
    if (!assignment) throw new NotFoundException('Смена не найдена');
    const targetEmployeeId = input.employeeId ?? assignment.employeeId;
    const targetDate = input.date ?? assignment.date;
    if (targetEmployeeId !== assignment.employeeId || targetDate !== assignment.date) {
      const occupied = await this.assignments.findOneBy({ employeeId: targetEmployeeId, date: targetDate });
      if (occupied && occupied.id !== id) throw new ConflictException('Целевая ячейка уже занята');
    }
    const template = input.templateId ? await this.templates.findOneBy({ id: input.templateId }) : null;
    if (input.templateId && !template) throw new NotFoundException('Шаблон смены не найден');
    Object.assign(assignment, template ? {
      templateId: template.id, templateName: template.name, startTime: template.startTime, endTime: template.endTime, color: template.color,
    } : input.startTime && input.endTime ? {
      ...input, templateId: null, templateName: 'Своя смена', color: '#9eb0ff',
    } : input);
    return { data: [this.toAssignment(await this.assignments.save(assignment))] };
  }

  async remove(id: string): Promise<void> {
    if (!(await this.assignments.delete(id)).affected) throw new NotFoundException('Смена не найдена');
  }

  async publish(): Promise<{ data: { publishedAt: string } }> {
    const publishedAt = new Date();
    await this.state.save({ id: 'default', publishedAt });
    return { data: { publishedAt: publishedAt.toISOString() } };
  }

  private toAssignment(entity: ShiftAssignmentEntity): ShiftAssignment {
    return {
      id: entity.id, employeeId: entity.employeeId, date: entity.date,
      startTime: entity.startTime.slice(0, 5), endTime: entity.endTime.slice(0, 5),
      templateId: entity.templateId, templateName: entity.templateName, color: entity.color,
    };
  }

  private toTemplate(entity: ShiftTemplateEntity): ShiftTemplate {
    return {
      id: entity.id,
      name: entity.name,
      startTime: entity.startTime.slice(0, 5),
      endTime: entity.endTime.slice(0, 5),
      color: entity.color,
    };
  }
}
