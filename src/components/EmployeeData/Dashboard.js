import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Header from '../EmployeeData/Header';
import Table from '../EmployeeData/Table';
import { fetchEmployees } from '../../utils/server';

const Dashboard = ({ setIsAuthenticated }) => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const perPage = 5;

  useEffect(() => {
    const loadEmployees = async () => {
      setIsLoading(true);
      try {
        const data = await fetchEmployees();
        console.log('Fetched employees:', data);
        setEmployees(data.length ? data : []);
        if (!data.length) {
          Swal.fire({
            icon: 'warning',
            title: 'No Data',
            text: 'Add some data to get started.',
            showConfirmButton: true,
          });
        }
      } catch (error) {
        console.error('Error loading employees:', error.message, error.stack);
        setEmployees([]);
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to load employees. Please try again later.',
          showConfirmButton: true,
        });
      }
      setIsLoading(false);
      console.log('isLoading set to false, employees:', employees);
    };
    loadEmployees();
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    Swal.fire({
      icon: 'success',
      title: 'Logged Out!',
      text: 'You have been logged out.',
      showConfirmButton: false,
      timer: 1500,
    });
  };

  const handleDeleteSelected = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: `You are about to delete ${selectedEmployees.length} employee(s). This cannot be undone!`,
      showCancelButton: true,
      confirmButtonText: 'Yes, delete them!',
      cancelButtonText: 'No, cancel',
    });

    if (result.isConfirmed) {
      const promises = selectedEmployees.map(id =>
        fetch(`https://686f2a3891e85fac429ff4c3.mockapi.io/api/v1/data/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      await Promise.all(promises);
      const updatedEmployees = await fetchEmployees(); 
      setEmployees(updatedEmployees);
      setSelectedEmployees([]);
      setCurrentPage(1);
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: `${selectedEmployees.length} employee(s) have been deleted.`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const handleAddNewEmployee = () => {
    const newId = `temp-${Date.now()}`;
    setEmployees(prev => [{ id: newId, isNew: true }, ...prev]);
    setIsAdding(true);
    console.log('Added new employee row, id:', newId, 'isAdding:', true);
  };

  const filtered = employees.filter(e =>
    !e.isNew && (
      e.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.empID?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.salary?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.date?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (currentPage - 1) * perPage;
  const currentEmployees = filtered.slice(start, start + perPage);

  console.log('Rendering dashboard, currentEmployees:', currentEmployees, 'totalPages:', totalPages);

  return (
    <div className="py-10">
      {isLoading ? (
        <div className="text-center text-gray-600 text-lg">Loading...</div>
      ) : (
        <div className="card">
          <Header
            handleAddNewEmployee={handleAddNewEmployee}
            isAdding={isAdding}
            handleLogout={handleLogout}
            selectedEmployees={selectedEmployees}
            handleDeleteSelected={handleDeleteSelected}
          />
          <Table
            employees={employees}
            setEmployees={setEmployees}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedEmployees={selectedEmployees}
            setSelectedEmployees={setSelectedEmployees}
            setIsAdding={setIsAdding}
            isAdding={isAdding}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;