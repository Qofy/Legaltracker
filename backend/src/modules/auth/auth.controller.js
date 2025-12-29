const { Controller, Post, Get, Body, UseGuards } = require('@nestjs/common');
const { AuthService } = require('./auth.service');
const { JwtAuthGuard } = require('../../common/guards/jwt-auth.guard');
const { CurrentUser } = require('../../common/decorators/current-user.decorator');
const { Public } = require('../../common/decorators/public.decorator');

@Controller('auth')
class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  @Post('register')
  @Public()
  async register(@Body() registerDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user) {
    return this.authService.getMe(user.id);
  }
}

module.exports = { AuthController };
