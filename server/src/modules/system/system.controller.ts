import { Controller, Get } from '@nestjs/common';
import { env } from '../../config/env';

@Controller()
export class SystemController {
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('config')
  config() {
    return {
      nodeEnv: env().nodeEnv,
      port: env().port,
    };
  }
}

