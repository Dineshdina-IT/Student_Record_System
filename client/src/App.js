
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', rollNo: '', department: 'it', year: '2024' });
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState({ department: 'all', year: 'all' });

  const fetchStudents = async () => {
    const query = [];
    if (filter.department !== 'all') query.push(`department=${filter.department}`);
    if (filter.year !== 'all') query.push(`year=${filter.year}`);
    const queryString = query.length ? `?${query.join('&')}` : '';
    const res = await axios.get(`http://localhost:5000/students${queryString}`);
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, [filter]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:5000/students/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post('http://localhost:5000/students', form);
    }
    setForm({ name: '', rollNo: '', department: 'it', year: '2024' });
    fetchStudents();
  };

  const handleEdit = student => {
    setForm(student);
    setEditingId(student._id);
  };

  const handleDelete = async id => {
    await axios.delete(`http://localhost:5000/students/${id}`);
    fetchStudents();
  };

  return (
    <div className="container">
      <h1>🎓 Student Record System</h1>

      <form className="form" onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        <input name="rollNo" value={form.rollNo} onChange={handleChange} placeholder="Roll No" required />
        <select name="department" value={form.department} onChange={handleChange}>
          <option value="cse">CSE</option>
          <option value="it">IT</option>
          <option value="ece">ECE</option>
          <option value="production">Production</option>
        </select>
        <select name="year" value={form.year} onChange={handleChange}>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
        <button type="submit">{editingId ? 'Update' : 'Add'} Student</button>
      </form>

      <div className="filters">
        <label>Filter by Department:</label>
        <select onChange={e => setFilter({ ...filter, department: e.target.value })}>
          <option value="all">All</option>
          <option value="cse">CSE</option>
          <option value="it">IT</option>
          <option value="ece">ECE</option>
          <option value="production">Production</option>
        </select>

        <label>Filter by Year:</label>
        <select onChange={e => setFilter({ ...filter, year: e.target.value })}>
          <option value="all">All</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
        </select>
      </div>

      <div className="list">
        <h2>Student List</h2>
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll No</th>
                <th>Department</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.rollNo}</td>
                  <td>{s.department.toUpperCase()}</td>
                  <td>{s.year}</td>
                  <td>
                    <button onClick={() => handleEdit(s)}>✏️</button>
                    <button onClick={() => handleDelete(s._id)}>❌</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
