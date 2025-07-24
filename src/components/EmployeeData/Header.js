import React from 'react';

const Header = ({ handleAddNewEmployee, isAdding, handleLogout, selectedEmployees, handleDeleteSelected }) => {
  return (
    <header className="header">
      <h1 className="text-4xl font-bold text-gray-800">Employee Dashboard</h1>
      <div className="space-x-3">
        {selectedEmployees.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="button delete"
          >
            Delete Selected ({selectedEmployees.length})
          </button>
        )}
        <button
          onClick={handleAddNewEmployee}
          disabled={isAdding}
          className={`button add ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Add New Employee
        </button>
        <button
          onClick={handleLogout}
          className="button cancel"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;