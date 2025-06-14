import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState({ dept: '', year: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/students')
      .then(res => setStudents(res.data));
  }, []);

  const deleteStudent = id => {
    axios.delete(`http://localhost:5000/students/${id}`)
      .then(() => setStudents(students.filter(s => s._id !== id)));
  };

  const filtered = students.filter(s =>
    (!filter.dept || s.department === filter.dept) &&
    (!filter.year || s.year === filter.year)
  );

  return (
    <div>
      <h2>Student List</h2>
      <Link to="/add">Add Student</Link>
      <div>
        <select onChange={e => setFilter({ ...filter, dept: e.target.value })}>
          <option value="">All Depts</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
        </select>
        <select onChange={e => setFilter({ ...filter, year: e.target.value })}>
          <option value="">All Years</option>
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
      </div>
      <ul>
        {filtered.map(s => (
          <li key={s._id}>
            {s.name} | {s.rollNo} | {s.department} | Year {s.year}
            <Link to={`/edit/${s._id}`}>✏️</Link>
            <button onClick={() => deleteStudent(s._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StudentList;