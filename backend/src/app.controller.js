const { Controller, Dependencies, Get } = require('@nestjs/common');
const { AppService } = require('./app.service');
const { Public } = require('./common/decorators/public.decorator');

@Controller()
@Dependencies(AppService)
class AppController {
  constructor(appService) {
    this.appService = appService;
  }

  @Get()
  @Public()
  getHello() {
    return this.appService.getHello();
  }

  @Get('health')
  @Public()
  healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}

module.exports = { AppController };
