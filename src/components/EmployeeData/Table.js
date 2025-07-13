import React from 'react';

const Table = ({ employees, handleEdit, handleDelete, currentPage, setCurrentPage, totalPages, searchQuery, setSearchQuery }) => {

  const changePage = (page) => page >= 1 && page <= totalPages && setCurrentPage(page);

  return (
    <div style={{ padding: '10px' }}>
      <div style={{ textAlign: 'right', marginBottom: '16px' }}>
        <input className='search-bar'
          value={searchQuery}
          onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          placeholder="Search..." />
      </div>
      <table className="striped-table">
        <thead style={{ backgroundColor: '#5e5a5a', color: 'white' }}>
          <tr>
            <th >No.</th>
            <th >Emp ID</th>
            <th >First Name</th>
            <th >Last Name</th>
            <th >Email</th>
            <th >Salary</th>
            <th >DOJ</th>
            <th colSpan={2} style={{ textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length ? employees.map((e, i) => (
            <tr key={e.id}>
              <td>{(currentPage - 1) * 5 + i + 1}</td>
              <td >{e.empID}</td>
              <td >{e.firstName}</td>
              <td >{e.lastName}</td>
              <td >{e.email}</td>
              <td >{e.salary}</td>
              <td >{e.date}</td>
              <td style={{ textAlign: 'right' }}>
                <button style={{ padding: '9px 20px' }}
                  onClick={() => handleEdit(e.id)}>Edit</button>
              </td>
              <td style={{ textAlign: 'left' }} >
                <button className='delete-button'
                  onClick={() => handleDelete(e.id)}>Delete</button>
              </td>
            </tr>
          )) : <tr>
            <td colSpan={8} className='no-data'>No Employees</td>
          </tr>}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div style={{ textAlign: 'right', marginTop: '16px' }}>
          <div className='pagination-container'>
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              style={{
                padding: '6px 12px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.6 : 1,
              }}
            >
              {'<'}
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => changePage(i + 1)}
                style={{
                  padding: '6px 12px',
                  cursor: 'pointer',
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={{
                padding: '6px 12px',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              {'>'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;