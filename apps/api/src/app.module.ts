import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { User } from './users/user.entity.js';
import { ScheduleModule } from './schedule/schedule.module.js';
import { EmployeeEntity, ScheduleStateEntity, ShiftAssignmentEntity, ShiftTemplateEntity } from './schedule/schedule.entities.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.getOrThrow<string>('DATABASE_URL'),
        entities: [User, EmployeeEntity, ShiftTemplateEntity, ShiftAssignmentEntity, ScheduleStateEntity],
        synchronize: config.get('DB_SYNCHRONIZE', 'false') === 'true',
      }),
    }),
    AuthModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
