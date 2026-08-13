import React, { useEffect, useState, useMemo } from 'react';

const DENOM_LABELS = {
  '0.01': 'Pennies ($0.01)',
  '0.05': 'Nickels ($0.05)',
  '0.10': 'Dimes ($0.10)',
  '0.25': 'Quarters ($0.25)',
  '1': '$1 Bills',
  '2': '$2 Bills',
  '5': '$5 Bills',
  '10': '$10 Bills',
  '20': '$20 Bills',
};

function Results({
  employeeData,
  totalHours,
  totalTips,
  roundingSettings = {},
  onRestart,
  onReturnToRounding,
  onReturnToTipCounter,
  onReturnToEdit,
}) {
  const [roundedTotalTips, setRoundedTotalTips] = useState(0);
  const [roundedTotalHours, setRoundedTotalHours] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const validEmployeeData = useMemo(() => {
    return employeeData.filter((emp) => (emp.hoursWorked || 0) > 0);
  }, [employeeData]);

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

  // Export Full Summary to Text File
  const handleExportTextSummary = () => {
    const savedTallies = JSON.parse(localStorage.getItem('tipTallies')) || {};
    const savedSettings = roundingSettings.hoursRounding
      ? roundingSettings
      : JSON.parse(localStorage.getItem('roundingSettings')) || { hoursRounding: 'exact', tipsRounding: 'exact' };

    const dateStr = new Date().toLocaleString();

    let textContent = `==========================================\n`;
    textContent += `      STARBUCKS TIP DISTRIBUTION REPORT    \n`;
    textContent += `==========================================\n`;
    textContent += `Generated On: ${dateStr}\n\n`;

    textContent += `--- ROUNDING SETTINGS ---\n`;
    textContent += `Hours Rounding Rule: ${savedSettings.hoursRounding || 'exact'}\n`;
    textContent += `Tips Rounding Rule : ${savedSettings.tipsRounding || 'exact'}\n\n`;

    textContent += `--- CURRENCY TALLY BREAKDOWN ---\n`;
    let tallyGrandTotal = 0;

    Object.entries(savedTallies).forEach(([denomId, chunks]) => {
      if (Array.isArray(chunks) && chunks.length > 0) {
        const denomLabel = DENOM_LABELS[denomId] || `$${denomId}`;
        const denomSum = chunks.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
        tallyGrandTotal += denomSum;

        const chunkList = chunks.map((c, i) => `#${i + 1}: $${Number(c.amount).toFixed(2)}`).join(', ');
        textContent += `${denomLabel.padEnd(18)}: Total $${denomSum.toFixed(2).padStart(8)}  (Chunks: ${chunkList})\n`;
      }
    });

    textContent += `------------------------------------------\n`;
    textContent += `Total Tips Counted : $${tallyGrandTotal.toFixed(2)}\n\n`;

    textContent += `--- OVERALL STATS ---\n`;
    textContent += `Total Calculated Hours: ${roundedTotalHours.toFixed(2)} hrs\n`;
    textContent += `Total Exact Tips      : $${totalTips.toFixed(2)}\n`;
    textContent += `Total Tips Distributed: $${roundedTotalTips.toFixed(2)}\n`;
    const rate = roundedTotalHours > 0 ? roundedTotalTips / roundedTotalHours : 0;
    textContent += `Effective Tip Rate    : $${rate.toFixed(2)} / hr\n\n`;

    textContent += `--- PARTNER TIPS BREAKDOWN ---\n`;
    textContent += `NAME / PARTNER #          | HRS WORKED | EXACT TIPS | ROUNDED TIPS\n`;
    textContent += `------------------------------------------------------------------\n`;

    validEmployeeData.forEach((emp) => {
      const label = (emp.name ? emp.name : `Partner ${emp.employeeNumber}`).padEnd(25);
      const hrs = (emp.adjustedHours !== undefined ? emp.adjustedHours : emp.hoursWorked || 0).toFixed(2).padStart(10);
      const exact = `$${(emp.exactTips || 0).toFixed(2)}`.padStart(10);
      const rounded = `$${(emp.roundedTips || 0).toFixed(2)}`.padStart(12);

      textContent += `${label} | ${hrs} | ${exact} | ${rounded}\n`;
    });

    textContent += `==========================================\n`;

    // Trigger Browser Text File Download
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tip_Summary_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="results-wrapper">
      <div style={{ display: 'flex', gap: '0.5em', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button onClick={onRestart}>Restart</button>
        <button onClick={onReturnToEdit}>Edit Hours</button>
        <button onClick={onReturnToTipCounter}>Adjust Tip Tally</button>
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

      {/* Sticky Top Search Container with iOS Keyboard Jump Mitigation */}
      <div className="sticky-search-wrapper">
        <input
          type="text"
          className="search-input"
          placeholder="Search partner name or number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
        />
      </div>

      <div className="table-viewport-lock">
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

      {/* Save Summary as Text File Button */}
      <div style={{ marginTop: '1.5em', marginBottom: '1em' }}>
        <button onClick={handleExportTextSummary} className="save-summary-btn">
          📥 Save Summary as Text File
        </button>
      </div>
    </div>
  );
}

export default Results;
