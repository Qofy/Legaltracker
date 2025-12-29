const { Injectable, ExecutionContext } = require('@nestjs/common');
const { AuthGuard } = require('@nestjs/passport');
const { Reflector } = require('@nestjs/core');
const { IS_PUBLIC_KEY } = require('../decorators/public.decorator');

@Injectable()
class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(reflector) {
    super();
    this.reflector = reflector;
  }

  canActivate(context) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}

module.exports = { JwtAuthGuard };
