const mongoose = require('mongoose');

// Mock User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ['student', 'alumni', 'admin', 'faculty'], default: 'student' },
  batchYear: { type: String, required: function() { return this.isNew && ['student', 'alumni'].includes(this.role); } },
  phoneNumber: { type: String, required: function() { return this.isNew && ['student', 'alumni'].includes(this.role); } },
});

const User = mongoose.model('User', userSchema);

async function test() {
  console.log('--- Testing New Student (Should Fail without Phone) ---');
  const newStudent = new User({
    name: 'New Student',
    role: 'student',
    phoneNumber: ''
  });
  console.log('isNew:', newStudent.isNew);
  try {
    await newStudent.validate();
    console.log('❌ New Student validation passed (Unexpected)');
  } catch (err) {
    console.log('✅ New Student validation failed as expected:', err.message);
  }

  console.log('\n--- Testing "Existing" Student Update (Should Pass without Phone) ---');
  const existingStudent = new User({
    name: 'Existing Student',
    role: 'student',
    // No phone number provided
  });
  
  // Simulate existing document
  existingStudent.isNew = false;
  console.log('isNew:', existingStudent.isNew);
  
  try {
    await existingStudent.validate();
    console.log('✅ Existing Student update validation passed (Correct)');
  } catch (err) {
    console.error('❌ Existing Student update validation failed:', err.message);
  }
}

test();
