const { Module } = require('@nestjs/common');
const { APP_GUARD } = require('@nestjs/core');
const { AppController } = require('./app.controller');
const { AppService } = require('./app.service');
const { PrismaModule } = require('./modules/prisma/prisma.module');
const { AuthModule } = require('./modules/auth/auth.module');
const { JwtAuthGuard } = require('./common/guards/jwt-auth.guard');

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
class AppModule {}

module.exports = { AppModule };
