const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;
const secretKey = 'your-secret-key'; // Change this to a secure key in production

app.use(cors());
app.use(bodyParser.json());
// Serve the static frontend (index.html, css/, js/, manifest, service-worker.js, etc.)
app.use(express.static(__dirname));
app.use('/uploads', express.static('uploads')); // Serve uploaded avatars

// In-memory storage (replace with database in production)
const users = [];
const verificationCodes = {}; // email: {code, reset: boolean}
const upload = multer({ dest: 'uploads/' });

// Helper to generate 6-digit code
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Register
app.post('/api/register', async (req, res) => {
  const { username, email, phone, password, age } = req.body;
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, username, email, phone, age, password: hashedPassword, avatar: null };
  users.push(newUser);

  const code = generateCode();
  verificationCodes[email] = { code, reset: false };
  console.log(`Verification code for ${email}: ${code}`); // In production, send via email

  res.json({ message: 'Registration successful' });
});

// Verify email
app.post('/api/verify', (req, res) => {
  const { email, code } = req.body;
  if (verificationCodes[email] && verificationCodes[email].code === code && !verificationCodes[email].reset) {
    delete verificationCodes[email];
    const user = users.find(u => u.email === email);
    const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
    res.json({ token, user });
  } else {
    res.status(400).json({ error: 'Invalid code' });
  }
});

// Resend verification code
app.post('/api/resend-code', (req, res) => {
  const { email } = req.body;
  if (verificationCodes[email]) {
    console.log(`Resent code for ${email}: ${verificationCodes[email].code}`);
    res.json({ message: 'Code resent' });
  } else {
    res.status(400).json({ error: 'No active code' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
  res.json({ token, user });
});

// Forgot password
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'User not found' });
  }
  const code = generateCode();
  verificationCodes[email] = { code, reset: true };
  console.log(`Reset code for ${email}: ${code}`); // In production, send via email
  res.json({ message: 'Reset code sent' });
});

// Reset password
app.post('/api/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (verificationCodes[email] && verificationCodes[email].code === code && verificationCodes[email].reset) {
    const user = users.find(u => u.email === email);
    user.password = await bcrypt.hash(newPassword, 10);
    delete verificationCodes[email];
    res.json({ message: 'Password reset successful' });
  } else {
    res.status(400).json({ error: 'Invalid code' });
  }
});

// Get profile (protected)
app.get('/api/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { id } = jwt.verify(token, secretKey);
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Update profile (protected)
app.put('/api/profile', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { id } = jwt.verify(token, secretKey);
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { username, age, phone } = req.body;
    user.username = username || user.username;
    user.age = age || user.age;
    user.phone = phone || user.phone;
    res.json({ user });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Upload avatar (protected)
app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const { id } = jwt.verify(token, secretKey);
    const user = users.find(u => u.id === id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.avatar) fs.unlinkSync(path.join(__dirname, user.avatar)); // Delete old avatar
    user.avatar = `/uploads/${req.file.filename}`;
    res.json({ avatarUrl: user.avatar });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Visitors API (заглушка для локальной разработки)
const visitors = new Set();
app.get('/api/visitors', (req, res) => {
  const { id } = req.query;
  if (id) visitors.add(id);
  res.json({ ok: true, totalUsers: visitors.size });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});