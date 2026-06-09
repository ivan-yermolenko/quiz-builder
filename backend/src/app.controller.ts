import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get application health status' })
  @ApiResponse({
    status: 200,
    description: 'Application is running smoothly',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2026-06-09T08:40:00.000Z' },
        version: { type: 'string', example: '1.0.0' },
      },
    },
  })
  getHealth() {
    return this.appService.getHealth();
  }
}
