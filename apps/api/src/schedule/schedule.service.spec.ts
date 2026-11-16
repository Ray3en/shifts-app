import { NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ScheduleService } from './schedule.service.js';

const employeeId = '11111111-1111-4111-8111-111111111111';
const templateId = '22222222-2222-4222-8222-222222222222';
const assignmentId = '33333333-3333-4333-8333-333333333333';

function repository() {
  return {
    count: vi.fn(), find: vi.fn(), findOneBy: vi.fn(), save: vi.fn(),
    create: vi.fn((value) => value), delete: vi.fn(),
  };
}

describe('ScheduleService business rules', () => {
  const employees = repository();
  const templates = repository();
  const assignments = repository();
  const state = repository();
  const service = new ScheduleService(employees as never, templates as never, assignments as never, state as never);

  beforeEach(() => {
    vi.clearAllMocks();
    employees.find.mockResolvedValue([]);
    assignments.save.mockImplementation(async (value) => ({ id: assignmentId, ...value }));
  });

  it('creates a shift from a template', async () => {
    templates.findOneBy.mockResolvedValue({ id: templateId, name: 'Утро', startTime: '07:00:00', endTime: '15:00:00', color: '#9eb0ff' });
    assignments.findOneBy.mockResolvedValue(null);

    const result = await service.create({ cells: [{ employeeId, date: '2026-11-16' }], templateId });

    expect(assignments.save).toHaveBeenCalledWith(expect.objectContaining({ employeeId, templateId, startTime: '07:00:00', endTime: '15:00:00' }));
    expect(result.data[0]).toEqual(expect.objectContaining({ id: assignmentId, templateName: 'Утро', startTime: '07:00', endTime: '15:00' }));
  });

  it('returns employees and templates with client-compatible time values', async () => {
    employees.find.mockResolvedValue([{ id: employeeId, fullName: 'Кузнецова Алина', role: 'агент', weeklyHours: 24, color: '#fff' }]);
    templates.find.mockResolvedValue([{ id: templateId, name: 'Утро', startTime: '07:00:00', endTime: '15:00:00', color: '#9eb0ff' }]);
    assignments.find.mockResolvedValue([]);
    state.findOneBy.mockResolvedValue({ id: 'default', publishedAt: null });

    const result = await service.getSchedule({ from: '2026-11-16', to: '2026-11-22', search: '' });

    expect(result.data.employees[0]?.fullName).toBe('Кузнецова Алина');
    expect(result.data.templates).toEqual([
      expect.objectContaining({ name: 'Утро', startTime: '07:00', endTime: '15:00' }),
    ]);
  });

  it('rejects overlapping shifts in the same employee/date cell', async () => {
    const existing = { id: assignmentId, employeeId, date: '2026-11-16' };
    templates.findOneBy.mockResolvedValue({ id: templateId, name: 'Вечер', startTime: '15:00', endTime: '23:00', color: '#8edfdc' });
    assignments.findOneBy.mockResolvedValue(existing);

    await expect(service.create({ cells: [{ employeeId, date: '2026-11-16' }], templateId })).rejects.toThrow('На эту дату сотруднику уже назначена смена');
    expect(assignments.save).not.toHaveBeenCalled();
  });

  it('rejects an unknown shift template', async () => {
    templates.findOneBy.mockResolvedValue(null);
    await expect(service.create({ cells: [{ employeeId, date: '2026-11-16' }], templateId })).rejects.toBeInstanceOf(NotFoundException);
    expect(assignments.save).not.toHaveBeenCalled();
  });

  it('removes an existing shift and rejects a missing one', async () => {
    assignments.delete.mockResolvedValueOnce({ affected: 1 });
    await expect(service.remove(assignmentId)).resolves.toBeUndefined();
    assignments.delete.mockResolvedValueOnce({ affected: 0 });
    await expect(service.remove(assignmentId)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('moves an existing shift to an empty employee/date slot', async () => {
    const assignment = { id: assignmentId, employeeId, date: '2026-11-16', startTime: '07:00', endTime: '15:00', templateId, templateName: 'Утро', color: '#fff' };
    assignments.findOneBy.mockResolvedValueOnce(assignment).mockResolvedValueOnce(null);
    await service.update(assignmentId, { employeeId: '44444444-4444-4444-8444-444444444444', date: '2026-11-17' });
    expect(assignments.save).toHaveBeenCalledWith(expect.objectContaining({ employeeId: '44444444-4444-4444-8444-444444444444', date: '2026-11-17' }));
  });

  it('replaces an existing template shift with a custom shift', async () => {
    const assignment = { id: assignmentId, employeeId, date: '2026-11-16', startTime: '07:00', endTime: '15:00', templateId, templateName: 'Утро', color: '#9eb0ff' };
    assignments.findOneBy.mockResolvedValue(assignment);

    const result = await service.update(assignmentId, { startTime: '09:00', endTime: '17:00' });

    expect(assignments.save).toHaveBeenCalledWith(expect.objectContaining({
      startTime: '09:00', endTime: '17:00', templateId: null, templateName: 'Своя смена',
    }));
    expect(result.data[0]).toEqual(expect.objectContaining({ templateId: null, templateName: 'Своя смена' }));
  });

  it('publishes the schedule with a persisted timestamp', async () => {
    state.save.mockImplementation(async (value) => value);
    const result = await service.publish();
    expect(state.save).toHaveBeenCalledWith({ id: 'default', publishedAt: expect.any(Date) });
    expect(Date.parse(result.data.publishedAt)).not.toBeNaN();
  });

  it('seeds employees and three time templates for an empty database', async () => {
    employees.count.mockResolvedValue(0);
    templates.count.mockResolvedValue(0);
    state.findOneBy.mockResolvedValue(null);
    employees.save.mockImplementation(async (value) => value);
    templates.save.mockImplementation(async (value) => value);

    await service.onModuleInit();

    expect(employees.save).toHaveBeenCalledWith(expect.arrayContaining([
      expect.objectContaining({ fullName: 'Кузнецова Алина' }),
      expect.objectContaining({ fullName: 'Соколов Артём' }),
    ]));
    expect(templates.save).toHaveBeenCalledWith([
      expect.objectContaining({ name: 'Утро', startTime: '07:00', endTime: '15:00' }),
      expect.objectContaining({ name: 'День', startTime: '10:00', endTime: '18:00' }),
      expect.objectContaining({ name: 'Вечер', startTime: '15:00', endTime: '23:00' }),
    ]);
  });
});
