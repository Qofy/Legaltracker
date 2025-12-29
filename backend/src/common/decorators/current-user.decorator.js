const { createParamDecorator, ExecutionContext } = require('@nestjs/common');

const CurrentUser = createParamDecorator(
  (data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

module.exports = { CurrentUser };
