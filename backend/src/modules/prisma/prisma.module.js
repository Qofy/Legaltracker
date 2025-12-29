const { Module } = require('@nestjs/common');
const { PrismaService } = require('./prisma.service');

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
class PrismaModule {}

module.exports = { PrismaModule };
