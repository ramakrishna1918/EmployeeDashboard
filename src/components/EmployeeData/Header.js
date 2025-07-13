import React from 'react';

const Header = ({ setIsAdding }) => {
  return (
    <header>
      <h1 style={{ textAlign: 'center' }}>Employees Dashboard</h1>
      <div className='header-button'>
        <button onClick={() => setIsAdding(true)}>Add New Employee</button>
      </div>
    </header>
  );
};

export default Header;
