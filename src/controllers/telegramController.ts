import { Controller, Get } from '@nestjs/common';

@Controller('telegram')
export class TelegramController {
  @Get('health')
  healthCheck(): string {
    return 'Healthy as an ox';
  }
}