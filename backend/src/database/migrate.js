const db = require('./database');
const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split by semicolon and execute each statement
const statements = schema.split(';').filter(stmt => stmt.trim());

let completed = 0;
const total = statements.length;

statements.forEach((statement, index) => {
  db.run(statement, (err) => {
    if (err) {
      console.error(`Error executing statement ${index + 1}:`, err.message);
    } else {
      completed++;
      console.log(`✓ Statement ${index + 1}/${total} executed`);
    }

    // Close database after all statements are executed
    if (completed === total) {
      console.log('\n✓ Database migration completed successfully!');
      db.close((err) => {
        if (err) console.error('Error closing database:', err.message);
      });
    }
  });
});
