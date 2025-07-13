import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { addEmployee } from '../../utils/server';

const Add = ({ employees, setEmployees, setIsAdding }) => {
  const [empID, setEmpID] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [salary, setSalary] = useState('');
  const [date, setDate] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!empID || !firstName || !lastName || !email || !salary || !date) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }
    const newEmployee = {
      empID,
      firstName,
      lastName,
      email,
      salary: String(salary),
      date,
    };
    await addEmployee(newEmployee, employees, setEmployees, setIsAdding);
  };

  return (
    <div className="small-container">
      <form onSubmit={handleAdd}>
        <h1 style={{ textAlign: 'center' }}>Add Employee</h1>
        <div className="form-container" >
          <label htmlFor="empID">Emp ID</label>
          <input
            id="empID"
            type="number"
            name="empID"
            value={empID}
            onChange={(e) => setEmpID(e.target.value)}
          />
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label htmlFor="salary">Salary</label>
          <input
            id="salary"
            type="number"
            name="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
          <label htmlFor="date">DOJ</label>
          <input
            id="date"
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className='button-container'>
          <input type="submit" value="Add" className="button bg-blue-500 text-white" />
          <input
            style={{ marginLeft: '12px' }}
            className="button muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsAdding(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Add;