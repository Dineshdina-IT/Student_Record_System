import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function AddStudent() {
  const [student, setStudent] = useState({ name: '', rollNo: '', department: '', year: '' });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/students/${id}`)
        .then(res => setStudent(res.data));
    }
  }, [id]);

  const handleChange = e => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const api = id
      ? axios.put(`http://localhost:5000/students/${id}`, student)
      : axios.post('http://localhost:5000/students', student);

    api.then(() => navigate('/'));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" placeholder="Name" value={student.name} onChange={handleChange} />
      <input name="rollNo" placeholder="Roll No" value={student.rollNo} onChange={handleChange} />
      <input name="department" placeholder="Department" value={student.department} onChange={handleChange} />
      <input name="year" placeholder="Year" value={student.year} onChange={handleChange} />
      <button type="submit">{id ? 'Update' : 'Add'} Student</button>
    </form>
  );
}

export default AddStudent;