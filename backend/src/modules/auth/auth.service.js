const { Injectable, UnauthorizedException, ConflictException } = require('@nestjs/common');
const { JwtService } = require('@nestjs/jwt');
const { PrismaService } = require('../prisma/prisma.service');
const bcrypt = require('bcrypt');

@Injectable()
class AuthService {
  constructor(prisma, jwtService) {
    this.prisma = prisma;
    this.jwt = jwtService;
  }

  async register(registerDto) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        fullName: registerDto.fullName,
        userType: registerDto.userType || 'customer',
        profilePicture: registerDto.profilePicture || null,
      },
    });

    // Create profile based on user type
    if (user.userType === 'lawyer' && registerDto.barNumber) {
      await this.prisma.lawyer.create({
        data: {
          userId: user.id,
          barNumber: registerDto.barNumber,
          licenseState: registerDto.licenseState || null,
        },
      });
    } else if (user.userType === 'customer') {
      await this.prisma.customer.create({
        data: {
          userId: user.id,
          companyName: registerDto.companyName || null,
          phonePrimary: registerDto.phonePrimary || null,
        },
      });
    }

    return this.generateTokens(user);
  }

  async login(loginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return this.generateTokens(user);
  }

  async validateUser(userId) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        userType: true,
        isActive: true,
        profilePicture: true,
      },
    });
  }

  async getMe(userId) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        userType: true,
        profilePicture: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Get additional profile data based on user type
    if (user.userType === 'lawyer') {
      const lawyer = await this.prisma.lawyer.findUnique({
        where: { userId: user.id },
      });
      user.profile = lawyer;
    } else if (user.userType === 'customer') {
      const customer = await this.prisma.customer.findUnique({
        where: { userId: user.id },
      });
      user.profile = customer;
    }

    return user;
  }

  generateTokens(user) {
    const payload = {
      sub: user.id,
      email: user.email,
      userType: user.userType,
    };

    const accessToken = this.jwt.sign(payload, {
      expiresIn: process.env.JWT_EXPIRATION || '1h',
    });

    const refreshToken = this.jwt.sign(payload, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        userType: user.userType,
        profilePicture: user.profilePicture,
      },
    };
  }
}

module.exports = { AuthService };
