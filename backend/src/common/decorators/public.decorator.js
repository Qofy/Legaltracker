const { SetMetadata } = require('@nestjs/common');

const IS_PUBLIC_KEY = 'isPublic';
const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

module.exports = { Public, IS_PUBLIC_KEY };
