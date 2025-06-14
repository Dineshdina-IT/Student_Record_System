
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Student = require('./Student');

const app = express();
const PORT = 5000;


const MONGO_URI = 'mongodb://localhost:27017/studentDB';

app.use(cors());
app.use(express.json());


mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB (local)'))
.catch(err => console.error('❌ MongoDB connection error:', err));


app.get('/students', async (req, res) => {
  const { department, year } = req.query;
  let filter = {};

  if (department && department !== 'all') {
    filter.department = department;
  }

  if (year && year !== 'all') {
    filter.year = year;
  }

  const students = await Student.find(filter);
  res.json(students);
});

app.post('/students', async (req, res) => {
  const { name, rollNo, department, year } = req.body;

  const validDepartments = ['cse', 'it', 'ece', 'production'];
  const validYears = ['2024', '2025', '2026'];

  if (!validDepartments.includes(department.toLowerCase())) {
    return res.status(400).json({ error: 'Invalid department' });
  }

  if (!validYears.includes(year)) {
    return res.status(400).json({ error: 'Invalid year' });
  }

  const newStudent = new Student({ name, rollNo, department, year });
  const saved = await newStudent.save();
  res.json(saved);
});

app.put('/students/:id', async (req, res) => {
  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete('/students/:id', async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: 'Student deleted' });
});


app.get('/', (req, res) => {
  res.send('🎓 Student Record Backend Running');
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
