const { Injectable, CanActivate, ExecutionContext, ForbiddenException } = require('@nestjs/common');
const { Reflector } = require('@nestjs/core');
const { ROLES_KEY } = require('../decorators/roles.decorator');

@Injectable()
class RolesGuard {
  constructor(reflector) {
    this.reflector = reflector;
  }

  canActivate(context) {
    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.userType)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}

module.exports = { RolesGuard };
