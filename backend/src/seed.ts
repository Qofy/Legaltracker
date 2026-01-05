import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/user.entity';
import { Case } from './cases/case.entity';

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
  const caseRepository = dataSource.getRepository(Case);

  // Check if any users exist
  const userCount = await userRepository.count();

  if (userCount === 0) {
    console.log('\n📋 Creating initial users and test data...');
    console.log('═'.repeat(50));

    // Create admin user
    const adminUser = userRepository.create({
      full_name: 'Admin User',
      email: 'admin@legal.com',
      password: await bcrypt.hash('admin123', 10),
      user_type: 'admin',
    });
    await userRepository.save(adminUser);

    // Create lawyer user - Kusi Frimpong
    const lawyerUser = userRepository.create({
      full_name: 'Kusi Frimpong',
      email: 'kusi.frimpong@legal.com',
      password: await bcrypt.hash('lawyer123', 10),
      user_type: 'lawyer',
    });
    await userRepository.save(lawyerUser);

    // Create customer user
    const customerUser = userRepository.create({
      full_name: 'John Customer',
      email: 'customer@example.com',
      password: await bcrypt.hash('customer123', 10),
      user_type: 'customer',
    });
    await userRepository.save(customerUser);

    // Create test cases without due dates
    const case1 = caseRepository.create({
      case_number: 'CASE-2026-001',
      title: 'Contract Dispute Resolution',
      description: 'Commercial contract dispute requiring urgent attention',
      status: 'open',
      priority: 'high',
      case_type: 'commercial',
      assigned_lawyer_id: lawyerUser.id,
      assigned_lawyer: lawyerUser,
      owners: [adminUser],
      customers: [customerUser],
    });
    await caseRepository.save(case1);

    const case2 = caseRepository.create({
      case_number: 'CASE-2026-002',
      title: 'Employment Law Matter',
      description: 'Workplace discrimination case',
      status: 'in_progress',
      priority: 'medium',
      case_type: 'employment',
      assigned_lawyer_id: lawyerUser.id,
      assigned_lawyer: lawyerUser,
      owners: [adminUser],
      customers: [customerUser],
    });
    await caseRepository.save(case2);

    const case3 = caseRepository.create({
      case_number: 'CASE-2026-003',
      title: 'Family Law Consultation',
      description: 'Child custody arrangement',
      status: 'open',
      priority: 'urgent',
      case_type: 'family',
      assigned_lawyer_id: lawyerUser.id,
      assigned_lawyer: lawyerUser,
      owners: [adminUser],
      customers: [customerUser],
    });
    await caseRepository.save(case3);

    console.log('\n✅ Created users:');
    console.log('   📧 Admin: admin@legal.com (password: admin123)');
    console.log('   📧 Lawyer: kusi.frimpong@legal.com (password: lawyer123)');
    console.log('   📧 Customer: customer@example.com (password: customer123)');
    console.log('\n✅ Created 3 test cases assigned to Kusi Frimpong');
    console.log('═'.repeat(50));
  } else {
    // Check if Kusi Frimpong exists
    const kusiExists = await userRepository.findOne({
      where: { full_name: 'Kusi Frimpong' }
    });

    if (!kusiExists) {
      console.log('\n📋 Adding Kusi Frimpong as a lawyer...');
      const lawyerUser = userRepository.create({
        full_name: 'Kusi Frimpong',
        email: 'kusi.frimpong@legal.com',
        password: await bcrypt.hash('lawyer123', 10),
        user_type: 'lawyer',
      });
      await userRepository.save(lawyerUser);
      console.log('✅ Kusi Frimpong added as a lawyer');
    }

    console.log(`\n✅ Database already has ${userCount} user(s).`);
    console.log('═'.repeat(50));
    console.log('\n📝 To create additional users:');
    console.log('   👉 Visit http://localhost:5174/signup');
    console.log('\n' + '═'.repeat(50));
  }

  console.log('✨ Seeding completed!\n');

  await dataSource.destroy();
}

seed().catch(error => {
  console.error('Error during seeding:', error);
  process.exit(1);
});
