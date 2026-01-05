const { DataSource } = require('typeorm');
const bcrypt = require('bcrypt');

async function addKusi() {
  const dataSource = new DataSource({
    type: 'better-sqlite3',
    database: process.env.DB_DATABASE || 'legalhub.db',
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('Database connected...');

    // Check if Kusi Frimpong exists
    const result = await dataSource.query(
      `SELECT * FROM users WHERE full_name = ? OR email = ?`, 
      ['Kusi Frimpong', 'kusi.frimpong@legal.com']
    );

    if (result.length === 0) {
      console.log('Adding Kusi Frimpong as a lawyer...');
      
      const hashedPassword = await bcrypt.hash('lawyer123', 10);
      
      await dataSource.query(`
        INSERT INTO users (id, full_name, email, password, user_type, created_date, updated_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        require('crypto').randomUUID(),
        'Kusi Frimpong',
        'kusi.frimpong@legal.com',
        hashedPassword,
        'lawyer',
        new Date().toISOString(),
        new Date().toISOString()
      ]);

      console.log('✅ Kusi Frimpong added successfully!');
      console.log('📧 Email: kusi.frimpong@legal.com');
      console.log('🔑 Password: lawyer123');
    } else {
      console.log('✅ Kusi Frimpong already exists in the database');
      console.log('User details:', result[0]);
    }

    // Add some test cases assigned to Kusi if they don't exist
    const cases = await dataSource.query(`SELECT * FROM cases`);
    
    if (cases.length === 0) {
      console.log('Adding test cases...');
      const kusiUser = await dataSource.query(`SELECT * FROM users WHERE full_name = ?`, ['Kusi Frimpong']);
      
      if (kusiUser.length > 0) {
        const lawyerId = kusiUser[0].id;
        
        await dataSource.query(`
          INSERT INTO cases (id, case_number, title, description, status, priority, case_type, assigned_lawyer_id, created_date, updated_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          require('crypto').randomUUID(),
          'CASE-2026-001',
          'Contract Dispute Resolution',
          'Commercial contract dispute requiring urgent attention',
          'open',
          'high',
          'commercial',
          lawyerId,
          new Date().toISOString(),
          new Date().toISOString()
        ]);

        await dataSource.query(`
          INSERT INTO cases (id, case_number, title, description, status, priority, case_type, assigned_lawyer_id, created_date, updated_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          require('crypto').randomUUID(),
          'CASE-2026-002',
          'Employment Law Matter',
          'Workplace discrimination case',
          'in_progress',
          'medium',
          'employment',
          lawyerId,
          new Date().toISOString(),
          new Date().toISOString()
        ]);

        console.log('✅ Added test cases assigned to Kusi Frimpong');
      }
    } else {
      console.log(`✅ Database already has ${cases.length} case(s)`);
    }

    await dataSource.destroy();
    console.log('✨ Complete!');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

addKusi();