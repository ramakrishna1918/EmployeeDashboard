import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Header from './Header';
import Table from './Table';
import Add from './AddEmployee';
import Edit from './EditEmployee';
import { fetchEmployees, deleteEmployee } from '../../utils/server';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const perPage = 5;

  useEffect(() => {
    const loadEmployees = async () => {
      setIsLoading(true);
      const data = await fetchEmployees();
      setEmployees(data.length ? data : []);
      if (!data.length)
        Swal.fire({
          icon: 'warning',
          title: 'No Data',
          text: 'Add some data.',
          showConfirmButton: true
        });
      setIsLoading(false);
    };
    loadEmployees();
  }, []);

  const handleEdit = (id) => {
    setSelectedEmployee(employees.find(e => e.id === id));
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    });

    if (result.isConfirmed) {
      await deleteEmployee(id, employees, setEmployees);
      setCurrentPage(1);
    }
  };

  const filtered = employees.filter(e =>
    e.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.empID.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.salary.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.date.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const currentEmployees = filtered.slice(start, start + perPage);

  return (
    <div style={{ margin: '0 auto', padding: '16px' }}>
      {isLoading ? 'Loading...'
        : (
          <>
            {!isAdding && !isEditing && <>
              <Header setIsAdding={setIsAdding} />
              <Table employees={currentEmployees}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}
                searchQuery={searchQuery} setSearchQuery={setSearchQuery} totalEmployees={filtered.length} />
            </>}
            {isAdding &&
              <Add employees={employees}
                setEmployees={setEmployees}
                setIsAdding={setIsAdding} />}
            {isEditing &&
              <Edit employees={employees}
                selectedEmployee={selectedEmployee}
                setEmployees={setEmployees}
                setIsEditing={setIsEditing} />}
          </>
        )}
    </div>
  );
};

export default Dashboard;