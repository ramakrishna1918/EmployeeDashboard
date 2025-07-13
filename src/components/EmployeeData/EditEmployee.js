import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { updateEmployee } from '../../utils/server';

const Edit = ({ employees, selectedEmployee, setEmployees, setIsEditing }) => {
  const id = selectedEmployee.id;
  const [empID, setEmpID] = useState(selectedEmployee.empID);
  const [firstName, setFirstName] = useState(selectedEmployee.firstName);
  const [lastName, setLastName] = useState(selectedEmployee.lastName);
  const [email, setEmail] = useState(selectedEmployee.email);
  const [salary, setSalary] = useState(selectedEmployee.salary || '');
  const [date, setDate] = useState(selectedEmployee.date || '');

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!empID || !firstName || !lastName || !email || !salary || !date) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
    }
    const updatedEmployee = {
      id,
      empID,
      firstName,
      lastName,
      email,
      salary: String(salary),
      date,
    };
    await updateEmployee(id, updatedEmployee, employees, setEmployees, setIsEditing);
  };

  return (
    <div className="small-container">
      <form onSubmit={handleUpdate}>
        <h1 style={{ textAlign: 'center' }}>Edit Employee</h1>
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
          <input type="submit" value="Update" className="button bg-blue-500 text-white" />
          <input
            style={{ marginLeft: '12px' }}
            className="button muted-button"
            type="button"
            value="Cancel"
            onClick={() => setIsEditing(false)}
          />
        </div>
      </form>
    </div>
  );
};

export default Edit;