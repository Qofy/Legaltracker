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

  // Check if any users exist
  const userCount = await userRepository.count();

  if (userCount === 0) {
    console.log('\n📋 No users found in the database.');
    console.log('═'.repeat(50));
    console.log('\n✨ Please use the signup page to create your first user:');
    console.log('   👉 Navigate to http://localhost:5173/signup');
    console.log('\n   You can register as:');
    console.log('   • Admin - Full system access');
    console.log('   • Lawyer - Manage cases and clients');
    console.log('   • Customer - Access your cases');
    console.log('\n' + '═'.repeat(50));
  } else {
    console.log(`\n✅ Database already has ${userCount} user(s).`);
    console.log('═'.repeat(50));
    console.log('\n📝 To create additional users:');
    console.log('   👉 Visit http://localhost:5173/signup');
    console.log('\n' + '═'.repeat(50));
  }

  console.log('✨ Seeding completed!\n');

  await dataSource.destroy();
}

seed().catch(error => {
  console.error('Error during seeding:', error);
  process.exit(1);
});
