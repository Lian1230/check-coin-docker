import { Get, Controller, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  root(): string {
    return this.appService.check();
  }

  @Get('/limit')
  setLimit(@Query() query) {
    return this.appService.setLimit(query);
  }
}
