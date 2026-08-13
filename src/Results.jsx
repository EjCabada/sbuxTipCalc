// import React, { useEffect, useState, useMemo } from 'react';
//
// function Results({ employeeData, totalHours, totalTips, onRestart, onReturnToRounding }) {
//   const [roundedTotalTips, setRoundedTotalTips] = useState(0);
//   const [roundedTotalHours, setRoundedTotalHours] = useState(0);
//
//   // Calculate overall totals
//   useEffect(() => {
//     if (employeeData.length > 0) {
//       const totalRoundedTips = employeeData.reduce((sum, emp) => sum + (emp.roundedTips || 0), 0);
//       // Use adjustedHours if available (from Rounding step), otherwise fallback to hoursWorked
//       const totalAdjHours = employeeData.reduce((sum, emp) => sum + (emp.adjustedHours !== null && emp.adjustedHours !== undefined ? emp.adjustedHours : emp.hoursWorked || 0), 0);
//
//       setRoundedTotalTips(totalRoundedTips);
//       setRoundedTotalHours(totalAdjHours);
//     } else {
//          setRoundedTotalTips(0);
//          setRoundedTotalHours(0);
//     }
//   }, [employeeData]); // Recalculate when employeeData changes
//
//   // Calculate ranks for top 5 earners using useMemo for efficiency
//   const topEarnerRanks = useMemo(() => {
//     if (!employeeData || employeeData.length === 0) {
//       return new Map(); // Return an empty map if no data
//     }
//
//     // Create a copy to sort without mutating original data
//     const sortedData = [...employeeData].sort((a, b) => (b.roundedTips || 0) - (a.roundedTips || 0));
//
//     const ranks = new Map();
//     // Assign ranks 1-5
//     for (let i = 0; i < Math.min(sortedData.length, 5); i++) {
//        // Only assign rank if tips are greater than 0
//        if ((sortedData[i].roundedTips || 0) > 0) {
//            ranks.set(sortedData[i].employeeNumber, i + 1); // Rank is index + 1
//        } else {
//           break; // Stop if we hit non-positive tips, as the rest won't rank
//        }
//     }
//     return ranks;
//   }, [employeeData]); // Recalculate ranks only when employeeData changes
//
//   return (
//     <div>
//       {/* Buttons remain the same */}
//       <button onClick={onRestart}>Restart</button>
//       <button onClick={onReturnToRounding}>Return to Rounding</button>
//
//       {/* Stats Box remains the same */}
//       <div className='statsBox'>
//         <h3>Overall Stats</h3>
//         <p><strong>Total Hours Worked (Calculated):</strong> {roundedTotalHours.toFixed(2)}</p>
//         <p><strong>Total Exact Tips Entered:</strong> ${totalTips.toFixed(2)}</p>
//         <p><strong>Total Tips Distributed (Rounded):</strong> ${roundedTotalTips.toFixed(2)}</p>
//          {/* Check for roundedTotalHours being non-zero before dividing */}
//         <p><strong>Total Tips Counted:</strong> ${(roundedTotalHours > 0 ? roundedTotalTips / roundedTotalHours : 0).toFixed(2)}</p>
//       </div>
//
//       <h3>Partner Tips Breakdown</h3>
//       <table>
//         <thead>
//           <tr>
//             <th>Partner #</th>
//             <th>Hrs Worked</th> {/* Changed title slightly for clarity */}
//             <th>Exact Tips</th>
//             <th>Rounded Tips</th>
//           </tr>
//         </thead>
//         <tbody>
//           {/* Map through original employeeData to maintain original order */}
//           {employeeData.map((emp, index) => {
//             // Get the rank for the current employee from the calculated map
//             const rank = topEarnerRanks.get(emp.employeeNumber);
//             // Determine hours to display: adjustedHours first, then hoursWorked
//             const displayHours = emp.adjustedHours !== null && emp.adjustedHours !== undefined
//                                   ? emp.adjustedHours
//                                   : (emp.hoursWorked || 0);
//
//             return (
//               <tr key={emp.employeeNumber || index}> {/* Use employeeNumber as key if stable */}
//                 <td>
//                   {emp.employeeNumber}
//                   {/* Conditionally render the rank if it exists (i.e., top 5) */}
//                   {rank && <span className="top-earner-rank"> ({rank})</span>}
//                 </td>
//                  {/* Display calculated hours */}
//                 <td>{displayHours.toFixed(4)}</td>
//                 <td>${(emp.exactTips || 0).toFixed(2)}</td>
//                 <td>${(emp.roundedTips || 0).toFixed(2)}</td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// }
//
// export default Results;

import React, { useEffect, useState, useMemo } from 'react';

function Results({ employeeData, totalHours, totalTips, onRestart, onReturnToRounding, onReturnToEdit }) {
  const [roundedTotalTips, setRoundedTotalTips] = useState(0);
  const [roundedTotalHours, setRoundedTotalHours] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const validEmployeeData = useMemo(() => {
    return employeeData.filter((emp) => (emp.hoursWorked || 0) > 0);
  }, [employeeData]);

  // Real-Time Search Filter
  const filteredEmployeeData = useMemo(() => {
    if (!searchTerm.trim()) return validEmployeeData;
    const term = searchTerm.toLowerCase();
    return validEmployeeData.filter((emp) => {
      const nameMatch = emp.name ? emp.name.toLowerCase().includes(term) : false;
      const numMatch = emp.employeeNumber ? String(emp.employeeNumber).toLowerCase().includes(term) : false;
      const idMatch = emp.partnerNumber ? String(emp.partnerNumber).toLowerCase().includes(term) : false;
      return nameMatch || numMatch || idMatch;
    });
  }, [validEmployeeData, searchTerm]);

  useEffect(() => {
    if (validEmployeeData.length > 0) {
      const totalRoundedTips = validEmployeeData.reduce((sum, emp) => sum + (emp.roundedTips || 0), 0);
      const totalAdjHours = validEmployeeData.reduce(
        (sum, emp) => sum + (emp.adjustedHours !== null && emp.adjustedHours !== undefined ? emp.adjustedHours : emp.hoursWorked || 0),
        0
      );
      setRoundedTotalTips(totalRoundedTips);
      setRoundedTotalHours(totalAdjHours);
    } else {
      setRoundedTotalTips(0);
      setRoundedTotalHours(0);
    }
  }, [validEmployeeData]);

  const topEarnerRanks = useMemo(() => {
    if (!validEmployeeData || validEmployeeData.length === 0) return new Map();

    const sortedData = [...validEmployeeData].sort((a, b) => (b.roundedTips || 0) - (a.roundedTips || 0));
    const ranks = new Map();

    for (let i = 0; i < Math.min(sortedData.length, 5); i++) {
      if ((sortedData[i].roundedTips || 0) > 0) {
        ranks.set(sortedData[i].employeeNumber, i + 1);
      } else {
        break;
      }
    }
    return ranks;
  }, [validEmployeeData]);

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5em', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={onRestart}>Restart</button>
        <button onClick={onReturnToEdit}>Edit Partner Inputs</button>
        <button onClick={onReturnToRounding}>Return to Rounding</button>
      </div>

      <div className="statsBox">
        <h3>Overall Stats</h3>
        <p><strong>Total Hours Worked (Calculated):</strong> {roundedTotalHours.toFixed(2)}</p>
        <p><strong>Total Exact Tips Entered:</strong> ${totalTips.toFixed(2)}</p>
        <p><strong>Total Tips Distributed (Rounded):</strong> ${roundedTotalTips.toFixed(2)}</p>
        <p><strong>Total Tips Counted / Hr:</strong> ${(roundedTotalHours > 0 ? roundedTotalTips / roundedTotalHours : 0).toFixed(2)}</p>
      </div>

      <h3>Partner Tips Breakdown</h3>

      {/* Real-time Search Box */}
      <div className="search-bar-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search partner name or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Partner</th>
            <th>Hrs Worked</th>
            <th>Exact Tips</th>
            <th>Rounded Tips</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployeeData.length > 0 ? (
            filteredEmployeeData.map((emp, index) => {
              const rank = topEarnerRanks.get(emp.employeeNumber);
              const displayHours = emp.adjustedHours !== null && emp.adjustedHours !== undefined ? emp.adjustedHours : emp.hoursWorked || 0;

              // Exact 3-row alternating group shading
              const rowClass = Math.floor(index / 3) % 2 === 0 ? 'row-group-a' : 'row-group-b';
              const label = emp.name ? emp.name : `Partner ${emp.employeeNumber}`;

              return (
                <tr key={emp.employeeNumber || index} className={rowClass}>
                  <td>
                    {label}
                    {rank && <span className="top-earner-rank"> ({rank})</span>}
                  </td>
                  <td>{displayHours.toFixed(2)}</td>
                  <td>${(emp.exactTips || 0).toFixed(2)}</td>
                  <td>${(emp.roundedTips || 0).toFixed(2)}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', color: '#888' }}>
                No partners match "{searchTerm}"
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Results;
