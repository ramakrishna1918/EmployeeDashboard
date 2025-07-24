import Swal from 'sweetalert2';

export const fetchEmployees = async () => {
  try {
    const response = await fetch('https://686f2a3891e85fac429ff4c3.mockapi.io/api/v1/data', {
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status: ${response.status}, Message: ${errorText}`);
    }
    const data = await response.json();
    const result = Array.isArray(data) ? data : data.data && Array.isArray(data.data) ? data.data : [];
    console.log('fetchEmployees success:', result);
    return result;
  } catch (error) {
    console.error('fetchEmployees error:', error.message, error.stack);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: `Failed to load employees: ${error.message}`,
      showConfirmButton: true,
    });
    return [];
  }
};

export const addEmployee = async (newEmployee, employees, setEmployees, setIsAdding) => {
  try {
    const response = await fetch('https://686f2a3891e85fac429ff4c3.mockapi.io/api/v1/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmployee),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status: ${response.status}, Message: ${errorText}`);
    }
    const addedEmployee = await response.json();
    const employeeToAdd = Array.isArray(addedEmployee) ? addedEmployee[addedEmployee.length - 1] : addedEmployee.id ? addedEmployee : { ...newEmployee, id: Date.now() };
    setEmployees([...employees, employeeToAdd]);
    setIsAdding(false); 
    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: `${newEmployee.firstName} ${newEmployee.lastName}'s data has been added.`,
      showConfirmButton: false,
      timer: 1500,
    });
    console.log('addEmployee success:', employeeToAdd);
  } catch (error) {
    console.error('addEmployee error:', error.message, error.stack);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: `Failed to add employee: ${error.message}`,
      showConfirmButton: true,
    });
  }
};

export const updateEmployee = async (id, updatedEmployee, employees, setEmployees) => {
  try {
    const response = await fetch(`https://686f2a3891e85fac429ff4c3.mockapi.io/api/v1/data/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEmployee),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status: ${response.status}, Message: ${errorText}`);
    }
    const updatedData = await response.json();
    const employeeToUpdate = updatedData.id ? updatedData : { ...updatedEmployee };
    setEmployees(
      employees.map((employee) =>
        employee.id === id ? employeeToUpdate : employee
      )
    );
    Swal.fire({
      icon: 'success',
      title: 'Updated!',
      text: `${updatedEmployee.firstName} ${updatedEmployee.lastName}'s data updated.`,
      showConfirmButton: false,
      timer: 1500,
    });
    console.log('updateEmployee success:', employeeToUpdate);
  } catch (error) {
    console.error('updateEmployee error:', error.message, error.stack);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: `Failed to update employee: ${error.message}`,
      showConfirmButton: true,
    });
  }
};

export const deleteEmployee = async (id, employees, setEmployees) => {
  const [employee] = employees.filter((employee) => employee.id === id);
  try {
    const response = await fetch(`https://686f2a3891e85fac429ff4c3.mockapi.io/api/v1/data/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status: ${response.status}, Message: ${errorText}`);
    }
    setEmployees(employees.filter((employee) => employee.id !== id));
    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: `${employee.firstName} ${employee.lastName}'s data has been deleted.`,
      showConfirmButton: false,
      timer: 1500,
    });
    console.log('deleteEmployee success:', id);
  } catch (error) {
    console.error('deleteEmployee error:', error.message, error.stack);
    Swal.fire({
      icon: 'error',
      title: 'Error!',
      text: `Failed to delete employee: ${error.message}`,
      showConfirmButton: true,
    });
  }
};