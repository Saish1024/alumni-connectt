const mongoose = require('mongoose');

// Mock User Schema (simplified for testing)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumni', 'admin', 'faculty'], default: 'student' },
  batchYear: { type: String, required: function() { return ['student', 'alumni'].includes(this.role); } },
  phoneNumber: { type: String, required: function() { return ['student', 'alumni'].includes(this.role); } },
  industry: { type: String, required: function() { return ['student', 'alumni'].includes(this.role); } },
});

const User = mongoose.model('User', userSchema);

async function test() {
  console.log('--- Testing Admin (Should Pass with empty fields) ---');
  const admin = new User({
    name: 'Admin User',
    role: 'admin',
    phoneNumber: '',
    industry: '',
    batchYear: ''
  });
  
  try {
    await admin.validate();
    console.log('✅ Admin validation passed');
  } catch (err) {
    console.error('❌ Admin validation failed:', err.message);
  }

  console.log('\n--- Testing Student (Should Fail with empty fields) ---');
  const student = new User({
    name: 'Student User',
    role: 'student',
    phoneNumber: '',
    industry: '',
    batchYear: ''
  });
  
  try {
    await student.validate();
    console.log('✅ Student validation passed (Unexpected)');
  } catch (err) {
    console.log('✅ Student validation failed as expected:', err.message);
  }

  console.log('\n--- Testing Student (Should Pass with all fields) ---');
  const student2 = new User({
    name: 'Student User 2',
    role: 'student',
    phoneNumber: '1234567890',
    industry: 'CS',
    batchYear: '2024'
  });
  
  try {
    await student2.validate();
    console.log('✅ Full student validation passed');
  } catch (err) {
    console.error('❌ Full student validation failed:', err.message);
  }
}

test();
