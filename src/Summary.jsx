import React from 'react';

function Summary({ employeeData, onConfirm, onEditPartner, onBackToInput }) {
  const totalHoursCalculated = employeeData.reduce((sum, emp) => sum + (emp.hoursWorked || 0), 0);

  return (
    <div className="summary-container">
      <h2>Hours Summary</h2>
      <p>Review inputs before proceeding to rounding.</p>

      <table className="summary-table">
        <thead>
          <tr>
            <th>Partner #</th>
            <th>Hours Worked</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employeeData.map((emp, index) => (
            <tr key={emp.employeeNumber || index}>
              <td>Partner {emp.employeeNumber}</td>
              <td>{Number(emp.hoursWorked).toFixed(2)} hrs</td>
              <td>
                <button 
                  className="edit-partner-btn"
                  onClick={() => onEditPartner(index)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="statsBox" style={{ marginTop: '1.5em' }}>
        <p><strong>Total Calculated Hours:</strong> {totalHoursCalculated.toFixed(2)} hrs</p>
      </div>

      <div className="summary-actions" style={{ marginTop: '1em' }}>
        <button onClick={onBackToInput} style={{ backgroundColor: '#6c757d' }}>Add More Partners</button>
        <button onClick={onConfirm} style={{ backgroundColor: 'var(--sbuxbrightgreen)' }}>Confirm & Continue</button>
      </div>
    </div>
  );
}

export default Summary;
