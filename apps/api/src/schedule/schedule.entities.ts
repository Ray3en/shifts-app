import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'employees' })
export class EmployeeEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'full_name' }) fullName: string;
  @Column() role: string;
  @Column({ name: 'weekly_hours', type: 'int', default: 0 }) weeklyHours: number;
  @Column() color: string;
}

@Entity({ name: 'shift_templates' })
export class ShiftTemplateEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() name: string;
  @Column({ name: 'start_time', type: 'time' }) startTime: string;
  @Column({ name: 'end_time', type: 'time' }) endTime: string;
  @Column() color: string;
}

@Entity({ name: 'shift_assignments' })
@Index(['employeeId', 'date'], { unique: true })
export class ShiftAssignmentEntity {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ name: 'employee_id', type: 'uuid' }) employeeId: string;
  @Column({ type: 'date' }) date: string;
  @Column({ name: 'start_time', type: 'time' }) startTime: string;
  @Column({ name: 'end_time', type: 'time' }) endTime: string;
  @Column({ name: 'template_id', type: 'uuid', nullable: true }) templateId: string | null;
  @Column({ name: 'template_name', type: 'varchar', nullable: true }) templateName: string | null;
  @Column() color: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}

@Entity({ name: 'schedule_state' })
export class ScheduleStateEntity {
  @PrimaryColumn({ default: 'default' }) id: string;
  @Column({ name: 'published_at', type: 'timestamptz', nullable: true }) publishedAt: Date | null;
}
