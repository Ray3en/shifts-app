import { Controller, Get } from '@nestjs/common';
import type { HelloResponse } from '@mono/shared';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): HelloResponse {
    return { data: { message: this.appService.getHello() } };
  }
}
