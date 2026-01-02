import { DataSource } from 'typeorm';
import { User } from './users/user.entity';
import { Case } from './cases/case.entity';
import { Document } from './documents/document.entity';
import { ChatMessage } from './chat-messages/chat-message.entity';
import { ActionItem } from './action-items/action-item.entity';

async function seedDemoData() {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: process.env.DB_DATABASE || 'legalhub.db',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
  });

  await dataSource.initialize();
  console.log('📊 Connected to database');

  const userRepository = dataSource.getRepository(User);
  const caseRepository = dataSource.getRepository(Case);
  const documentRepository = dataSource.getRepository(Document);
  const chatMessageRepository = dataSource.getRepository(ChatMessage);
  const actionItemRepository = dataSource.getRepository(ActionItem);

  try {
    // Find any users with the appropriate roles
    const lawyer = await userRepository.findOne({ where: { user_type: 'lawyer' } });
    const customer = await userRepository.findOne({ where: { user_type: 'customer' } });

    if (!lawyer || !customer) {
      console.error('❌ Demo data requires at least one lawyer and one customer.');
      console.error('   Please create users via the signup page at http://localhost:5173/signup');
      console.error('   You need:');
      console.error('   - At least 1 user with role "Lawyer"');
      console.error('   - At least 1 user with role "Customer"');
      process.exit(1);
    }

    console.log(`✅ Found lawyer: ${lawyer.email}`);
    console.log(`✅ Found customer: ${customer.email}`);

    // Create demo cases
    const demoCase1 = caseRepository.create({
      title: 'Personal Injury Claim - Car Accident',
      case_number: 'CASE-2024-001',
      description: 'Client was injured in a car accident on Main Street. Seeking compensation for medical expenses and lost wages.',
      case_type: 'personal_injury',
      status: 'in_progress',
      priority: 'high',
      court_date: '2024-01-15',
      court_name: 'District Court of Central County',
      judge_name: 'Hon. Sarah Mitchell',
      owners: [lawyer],
      customers: [customer],
    });

    const demoCase2 = caseRepository.create({
      title: 'Contract Dispute - Business Agreement',
      case_number: 'CASE-2024-002',
      description: 'Dispute over terms of business partnership agreement. Seeking resolution and compensation.',
      case_type: 'civil',
      status: 'open',
      priority: 'medium',
      court_date: '2024-02-01',
      court_name: 'Business Court',
      judge_name: 'Hon. Robert Chen',
      owners: [lawyer],
      customers: [customer],
    });

    await caseRepository.save([demoCase1, demoCase2]);
    console.log('✅ Created demo cases');

    // Create demo documents
    const doc1 = documentRepository.create({
      case_id: demoCase1.id,
      file_name: 'Medical Records - January 2024.pdf',
      file_path: '/uploads/medical-records-jan-2024.pdf',
      document_type: 'evidence',
      visibility_type: 'case_members',
      uploaded_by: lawyer,
      description: 'Medical records from the accident',
    });

    const doc2 = documentRepository.create({
      case_id: demoCase1.id,
      file_name: 'Police Report.pdf',
      file_path: '/uploads/police-report.pdf',
      document_type: 'evidence',
      visibility_type: 'case_members',
      uploaded_by: lawyer,
      description: 'Official police report from the accident scene',
    });

    const doc3 = documentRepository.create({
      case_id: demoCase2.id,
      file_name: 'Partnership Agreement.pdf',
      file_path: '/uploads/partnership-agreement.pdf',
      document_type: 'contract',
      visibility_type: 'case_members',
      uploaded_by: lawyer,
      description: 'Original partnership agreement document',
    });

    await documentRepository.save([doc1, doc2, doc3]);
    console.log('✅ Created demo documents');

    // Create demo chat messages
    const msg1 = chatMessageRepository.create({
      case_id: demoCase1.id,
      sender_id: lawyer.id,
      content: 'Hello! I\'ve reviewed your case and the medical records look comprehensive. We have a strong case for compensation.',
    });

    const msg2 = chatMessageRepository.create({
      case_id: demoCase1.id,
      sender_id: customer.id,
      content: 'Thank you! When do you think we can expect a resolution?',
    });

    const msg3 = chatMessageRepository.create({
      case_id: demoCase1.id,
      sender_id: lawyer.id,
      content: 'Based on similar cases, we should expect a settlement offer within 60-90 days. I\'ll keep you updated on all developments.',
    });

    const msg4 = chatMessageRepository.create({
      case_id: demoCase2.id,
      sender_id: lawyer.id,
      content: 'I\'ve reviewed the partnership agreement. We have several strong points we can negotiate on.',
    });

    await chatMessageRepository.save([msg1, msg2, msg3, msg4]);
    console.log('✅ Created demo messages');

    // Create demo action items (deadlines)
    const task1 = actionItemRepository.create({
      case_id: demoCase1.id,
      title: 'Submit additional medical documentation',
      description: 'Provide recent medical reports and treatment records',
      due_date: '2024-03-15',
      status: 'pending',
      created_by_id: lawyer.id,
    });

    const task2 = actionItemRepository.create({
      case_id: demoCase1.id,
      title: 'Deposition scheduled',
      description: 'Client deposition with opposing counsel',
      due_date: '2024-03-01',
      status: 'pending',
      created_by_id: lawyer.id,
    });

    const task3 = actionItemRepository.create({
      case_id: demoCase2.id,
      title: 'Mediation session',
      description: 'Initial mediation with business partner',
      due_date: '2024-02-28',
      status: 'pending',
      created_by_id: lawyer.id,
    });

    await actionItemRepository.save([task1, task2, task3]);
    console.log('✅ Created demo tasks/deadlines');

    console.log('\n🎉 Demo data seeded successfully!');
    console.log('\n📝 Summary:');
    console.log(`   - Cases: 2`);
    console.log(`   - Documents: 3`);
    console.log(`   - Messages: 4`);
    console.log(`   - Tasks/Deadlines: 3`);
    console.log('\n🔐 Login credentials:');
    console.log(`   Lawyer: ${lawyer.email}`);
    console.log(`   Customer: ${customer.email}`);

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  } finally {
    await dataSource.destroy();
  }
}

seedDemoData()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
