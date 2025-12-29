const { Injectable } = require('@nestjs/common');

@Injectable()
class AppService {
  getHello() {
    return {
      message: 'LegalHub API',
      version: '1.0.0',
      status: 'running',
    };
  }
}

module.exports = { AppService };
