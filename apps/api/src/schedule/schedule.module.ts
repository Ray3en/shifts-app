import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module.js';
import { EmployeeEntity, ScheduleStateEntity, ShiftAssignmentEntity, ShiftTemplateEntity } from './schedule.entities.js';
import { ScheduleController } from './schedule.controller.js';
import { ScheduleService } from './schedule.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeEntity, ShiftTemplateEntity, ShiftAssignmentEntity, ScheduleStateEntity]), AuthModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
