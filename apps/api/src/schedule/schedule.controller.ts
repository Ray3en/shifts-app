import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { createAssignmentSchema, idSchema, scheduleQuerySchema, updateAssignmentSchema, type CreateAssignmentInput, type ScheduleQuery, type UpdateAssignmentInput } from '@mono/shared';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { ScheduleService } from './schedule.service.js';

@Controller('schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private readonly schedule: ScheduleService) {}

  @Get()
  get(@Query({ schema: scheduleQuerySchema }) query: ScheduleQuery) { return this.schedule.getSchedule(query); }

  @Post('assignments')
  create(@Body({ schema: createAssignmentSchema }) input: CreateAssignmentInput) { return this.schedule.create(input); }

  @Patch('assignments/:id')
  update(@Param('id', { schema: idSchema }) id: string, @Body({ schema: updateAssignmentSchema }) input: UpdateAssignmentInput) {
    return this.schedule.update(id, input);
  }

  @Delete('assignments/:id')
  @HttpCode(204)
  remove(@Param('id', { schema: idSchema }) id: string) { return this.schedule.remove(id); }

  @Post('publish')
  publish() { return this.schedule.publish(); }
}
