const { Injectable, UnauthorizedException } = require('@nestjs/common');
const { PassportStrategy } = require('@nestjs/passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const { PrismaService } = require('../../prisma/prisma.service');

@Injectable()
class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(prisma) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
    this.prisma = prisma;
  }

  async validate(payload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        fullName: true,
        userType: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }
}

module.exports = { JwtStrategy };
