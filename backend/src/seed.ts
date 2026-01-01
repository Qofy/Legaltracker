import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/user.entity';

async function seed() {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: process.env.DB_DATABASE || 'legalhub.db',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  });

  await dataSource.initialize();
  console.log('Database connected for seeding...');

  const userRepository = dataSource.getRepository(User);

  // Default users configuration
  const defaultUsers = [
    {
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@legalhub.com',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'Admin123!',
      full_name: 'System Administrator',
      user_type: 'admin',
      phone: '+1-555-0100',
      is_active: true,
    },
    {
      email: process.env.DEFAULT_LAWYER_EMAIL || 'lawyer@legalhub.com',
      password: process.env.DEFAULT_LAWYER_PASSWORD || 'Lawyer123!',
      full_name: 'John Smith',
      user_type: 'lawyer',
      phone: '+1-555-0101',
      bar_number: 'BAR123456',
      specializations: 'Civil Law, Corporate Law, Contract Law',
      firm_name: 'Smith & Associates',
      address: '123 Legal Street, Law City, LC 12345',
      is_active: true,
    },
    {
      email: process.env.DEFAULT_CUSTOMER_EMAIL || 'customer@legalhub.com',
      password: process.env.DEFAULT_CUSTOMER_PASSWORD || 'Customer123!',
      full_name: 'Jane Doe',
      user_type: 'customer',
      phone: '+1-555-0102',
      address: '456 Client Avenue, Client City, CC 67890',
      is_active: true,
    },
  ];

  // Create default users
  for (const userData of defaultUsers) {
    const existingUser = await userRepository.findOne({ where: { email: userData.email } });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = userRepository.create({
        ...userData,
        password: hashedPassword,
      });
      await userRepository.save(user);
      console.log(`✅ Created ${userData.user_type}: ${userData.email}`);
    } else {
      console.log(`⏭️  User already exists: ${userData.email}`);
    }
  }

  console.log('\n📋 Default User Credentials:');
  console.log('═'.repeat(50));
  defaultUsers.forEach(user => {
    console.log(`\n${user.user_type.toUpperCase()}:`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Password: ${user.password}`);
  });
  console.log('\n' + '═'.repeat(50));
  console.log('✨ Seeding completed!\n');

  await dataSource.destroy();
}

seed().catch(error => {
  console.error('Error during seeding:', error);
  process.exit(1);
});
