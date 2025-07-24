import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { updateEmployee, deleteEmployee, addEmployee, fetchEmployees } from '../../utils/server'; 

const Table = ({ employees, setEmployees, currentPage, setCurrentPage, totalPages, searchQuery, setSearchQuery, selectedEmployees, setSelectedEmployees, setIsAdding, isAdding }) => {
  const changePage = (page) => page >= 1 && page <= totalPages && setCurrentPage(page);

  const handleSelectEmployee = (id) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter(empId => empId !== id));
    } else {
      setSelectedEmployees([...selectedEmployees, id]);
    }
  };

  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (isAdding && employees.some(e => e.isNew)) {
      const newEmployee = employees.find(e => e.isNew);
      setEditingId(newEmployee.id);
      setEditData({
        empID: '',
        firstName: '',
        lastName: '',
        email: '',
        salary: '',
        date: '',
      });
      console.log('Set editingId for new employee:', newEmployee.id);
    }
  }, [isAdding, employees]);

  const saveEdit = async (id) => {
    if (!editData.firstName || !editData.lastName || !editData.email || !editData.salary || !editData.date) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
      return;
    }
    const empID = employees.find(e => e.id === id)?.empID || null;
    await updateEmployee(id, { id, empID, ...editData }, employees, setEmployees);
    setEditingId(null);
    const updatedEmployees = await fetchEmployees();
    setEmployees(updatedEmployees);
    console.log('Saved edit for employee:', id);
  };

  const saveNewEmployee = async (id) => {
    if (!editData.empID || !editData.firstName || !editData.lastName || !editData.email || !editData.salary || !editData.date) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
      return;
    }
    const newEmployee = { ...editData, salary: String(editData.salary) };
    await addEmployee(newEmployee, employees.filter(e => !e.isNew), setEmployees, () => setIsAdding(false));
    setEditingId(null);
    const updatedEmployees = await fetchEmployees();
    setEmployees(updatedEmployees);
    console.log('Saved new employee:', newEmployee);
  };

  const cancelAdd = (id) => {
    setEmployees(employees.filter(e => e.id !== id));
    setEditingId(null);
    setIsAdding(false);
    console.log('Cancelled adding employee:', id);
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
      console.log('Deleted employee:', id);
    }
  };

  const filteredEmployees = employees.filter(e =>
    !e.isNew && (
      e.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.empID?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.salary?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.date?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  const start = (currentPage - 1) * 5;
  const paginatedEmployees = [...employees.filter(e => e.isNew), ...filteredEmployees.slice(start, start + 5)];

  console.log('Rendering table with paginated employees:', paginatedEmployees);

  return (
    <div className="table-container">
      <div className="flex justify-end mb-4">
        <input
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          placeholder="Search employees..."
          className="search-input"
        />
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={selectedEmployees.length === employees.length && employees.length > 0 && !employees.some(e => e.isNew)}
                onChange={() => {
                  if (selectedEmployees.length === employees.length) {
                    setSelectedEmployees([]);
                  } else {
                    setSelectedEmployees(employees.filter(e => !e.isNew).map(e => e.id));
                  }
                }}
              />
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white-700 uppercase tracking-wider">No.</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white-700 uppercase tracking-wider">Emp ID</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white-700 uppercase tracking-wider">First Name</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white-700 uppercase tracking-wider">Last Name</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white-700 uppercase tracking-wider">Email</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white-700 uppercase tracking-wider">Salary</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white-700 uppercase tracking-wider">DOJ</th>
            <th className="px-6 py-4 text-left text-xs font-medium text-white-700 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedEmployees.length ? paginatedEmployees.map((e, i) => (
            <tr key={e.id} className={`table-row ${e.isNew ? 'new-row' : ''}`}>
              <td className="px-6 py-4 whitespace-nowrap">
                {!e.isNew && (
                  <input
                    type="checkbox"
                    checked={selectedEmployees.includes(e.id)}
                    onChange={() => handleSelectEmployee(e.id)}
                  />
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{e.isNew ? '-' : (currentPage - 1) * 5 + i + 1}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === e.id ? (
                  e.isNew ? (
                    <input
                      type="number"
                      value={editData.empID || ''}
                      onChange={(ev) => setEditData({ ...editData, empID: ev.target.value })}
                      className="table-input"
                    />
                  ) : (
                    e.empID
                  )
                ) : (
                  e.empID || ''
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === e.id ? (
                  <input
                    type="text"
                    value={editData.firstName}
                    onChange={(ev) => setEditData({ ...editData, firstName: ev.target.value })}
                    className="table-input"
                  />
                ) : (
                  e.firstName || ''
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === e.id ? (
                  <input
                    type="text"
                    value={editData.lastName}
                    onChange={(ev) => setEditData({ ...editData, lastName: ev.target.value })}
                    className="table-input"
                  />
                ) : (
                  e.lastName || ''
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === e.id ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(ev) => setEditData({ ...editData, email: ev.target.value })}
                    className="table-input"
                  />
                ) : (
                  e.email || ''
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === e.id ? (
                  <input
                    type="number"
                    value={editData.salary}
                    onChange={(ev) => setEditData({ ...editData, salary: ev.target.value })}
                    className="table-input"
                  />
                ) : (
                  e.salary || ''
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === e.id ? (
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(ev) => setEditData({ ...editData, date: ev.target.value })}
                    className="table-input"
                  />
                ) : (
                  e.date || ''
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingId === e.id ? (
                  <div className="space-x-2">
                    <button
                      onClick={() => e.isNew ? saveNewEmployee(e.id) : saveEdit(e.id)}
                      className="button"
                    >
                      {e.isNew ? 'Add' : 'Save'}
                    </button>
                    <button
                      onClick={() => e.isNew ? cancelAdd(e.id) : setEditingId(null)}
                      className="button cancel"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  !e.isNew && (
                    <div className="space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(e.id);
                          setEditData({
                            firstName: e.firstName || '',
                            lastName: e.lastName || '',
                            email: e.email || '',
                            salary: e.salary || '',
                            date: e.date || '',
                            empID: e.empID || '',
                          });
                          console.log('Editing employee:', e.id);
                        }}
                        className="button edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="button delete"
                      >
                        Delete
                      </button>
                    </div>
                  )
                )}
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan={9} className="no-data">No Employees</td>
            </tr>
          )}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className="flex justify-end mt-6 space-x-3">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => changePage(i + 1)}
              className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;