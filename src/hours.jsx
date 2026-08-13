// import { useState, useEffect, useRef } from 'react';
// import './App.css';
//
// function Hours({ onDone, onRestart, initialData = [], initialTotalHours = 0, targetPartnerIndex = null }) {
//   const [employee, setEmployees] = useState(
//     targetPartnerIndex !== null ? targetPartnerIndex + 1 : initialData.length + 1
//   );
//   const [workedHoursStr, setWorkedHoursStr] = useState('');
//   const [employeeData, setEmployeeData] = useState(initialData);
//   const [totalHours, setTotalHours] = useState(initialTotalHours);
//   const [fade, setFade] = useState(true);
//   const [isHighlighted, setIsHighlighted] = useState(false);
//   const [showRestartModal, setShowRestartModal] = useState(false);
//
//   const inputRef = useRef(null);
//
//   const getWorkedHours = () => parseFloat(workedHoursStr) || 0;
//
//   useEffect(() => {
//     const dataToLoad = initialData.length > 0 ? initialData : JSON.parse(localStorage.getItem('employeeData')) || [];
//     const hoursToLoad = initialTotalHours || JSON.parse(localStorage.getItem('totalHours')) || 0;
//
//     setEmployeeData(dataToLoad);
//     setTotalHours(hoursToLoad);
//
//     const currentEmployeeIndex = employee - 1;
//     if (dataToLoad[currentEmployeeIndex]) {
//       setWorkedHoursStr(String(dataToLoad[currentEmployeeIndex].hoursWorked || ''));
//     } else {
//       setWorkedHoursStr('');
//     }
//   }, [initialData, initialTotalHours, employee]);
//
//   useEffect(() => {
//     if (employeeData.length > 0) {
//       localStorage.setItem('employeeData', JSON.stringify(employeeData));
//       localStorage.setItem('totalHours', JSON.stringify(totalHours));
//     }
//   }, [employeeData, totalHours]);
//
//   const transitionEmployee = (callback) => {
//     setFade(false);
//     setTimeout(() => {
//       callback();
//       setFade(true);
//     }, 300);
//   };
//
//   const updateOrAddEmployeeData = (hoursValue) => {
//     let updatedData = [...employeeData];
//     let newTotalHours = totalHours;
//     const currentEmployeeIndex = employee - 1;
//
//     if (currentEmployeeIndex < updatedData.length) {
//       const oldHours = updatedData[currentEmployeeIndex].hoursWorked || 0;
//       const difference = hoursValue - oldHours;
//       updatedData[currentEmployeeIndex].hoursWorked = hoursValue;
//       newTotalHours += difference;
//     } else {
//       updatedData.push({ employeeNumber: employee, hoursWorked: hoursValue });
//       newTotalHours += hoursValue;
//     }
//
//     setEmployeeData(updatedData);
//     setTotalHours(newTotalHours);
//     return { updatedData, newTotalHours, addedOrUpdated: true };
//   };
//
//   const handleEnter = () => {
//     const currentHours = getWorkedHours();
//     transitionEmployee(() => {
//       const { addedOrUpdated } = updateOrAddEmployeeData(currentHours);
//       if (addedOrUpdated) {
//         setEmployees(employee + 1);
//         const nextEmployeeIndex = employee;
//         if (employeeData[nextEmployeeIndex]) {
//           setWorkedHoursStr(String(employeeData[nextEmployeeIndex].hoursWorked || ''));
//         } else {
//           setWorkedHoursStr('');
//         }
//       } else {
//         setWorkedHoursStr('');
//       }
//       setIsHighlighted(false);
//     });
//   };
//
//   const prevEmployee = () => {
//     const currentHours = getWorkedHours();
//     updateOrAddEmployeeData(currentHours);
//     transitionEmployee(() => {
//       if (employee > 1) {
//         const previousEmployeeIndex = employee - 2;
//         setEmployees(employee - 1);
//         setWorkedHoursStr(String(employeeData[previousEmployeeIndex]?.hoursWorked || ''));
//         setIsHighlighted(true); // Highlight text on back button press
//       }
//     });
//   };
//
//   const handleDone = () => {
//     const currentHours = getWorkedHours();
//     let finalData = [...employeeData];
//     const currentEmployeeIndex = employee - 1;
//
//     if (currentEmployeeIndex < finalData.length) {
//       finalData[currentEmployeeIndex].hoursWorked = currentHours;
//     } else if (currentHours > 0) {
//       finalData.push({ employeeNumber: employee, hoursWorked: currentHours });
//     }
//
//     // Exclude the last partner if hours worked is 0
//     if (finalData.length > 0 && finalData[finalData.length - 1].hoursWorked === 0) {
//       finalData.pop();
//     }
//
//     const finalTotalHours = finalData.reduce((sum, item) => sum + (item.hoursWorked || 0), 0);
//
//     // Save a backup snapshot before navigating away
//     localStorage.setItem('lastSavedList', JSON.stringify(finalData));
//     localStorage.setItem('lastSavedTotalHours', JSON.stringify(finalTotalHours));
//
//     onDone(finalData, finalTotalHours);
//   };
//
//   const confirmReset = () => {
//     setShowRestartModal(false);
//     transitionEmployee(() => {
//       setEmployeeData([]);
//       setTotalHours(0);
//       setEmployees(1);
//       setWorkedHoursStr('');
//       localStorage.removeItem('employeeData');
//       localStorage.removeItem('totalHours');
//       onRestart();
//     });
//   };
//
//   const handleLoadLastList = () => {
//     const backupData = JSON.parse(localStorage.getItem('lastSavedList')) || [];
//     const backupHours = JSON.parse(localStorage.getItem('lastSavedTotalHours')) || 0;
//
//     if (backupData.length === 0) {
//       alert('No previously saved list found.');
//       return;
//     }
//
//     setEmployeeData(backupData);
//     setTotalHours(backupHours);
//     setEmployees(1);
//     setWorkedHoursStr(String(backupData[0]?.hoursWorked || ''));
//     setIsHighlighted(true);
//   };
//
//   const handleNumpadClick = (value) => {
//     let currentStr = workedHoursStr;
//
//     // Replace value if input is highlighted from clicking Back
//     if (isHighlighted) {
//       currentStr = '';
//       setIsHighlighted(false);
//     }
//
//     if (value === 'del') {
//       setWorkedHoursStr(currentStr.slice(0, -1));
//       return;
//     }
//
//     if (value === '.') {
//       if (!currentStr.includes('.')) {
//         setWorkedHoursStr((currentStr === '' ? '0' : currentStr) + '.');
//       }
//       return;
//     }
//
//     let nextStr = currentStr === '0' ? value : currentStr + value;
//
//     // Auto-add decimal after entering two digits if no decimal exists yet
//     if (!nextStr.includes('.') && nextStr.length === 2) {
//       nextStr += '.';
//     }
//
//     setWorkedHoursStr(nextStr);
//   };
//
//   // Retrieve previous partner details for context display
//   const previousPartnerIndex = employee - 2;
//   const previousPartner = previousPartnerIndex >= 0 ? employeeData[previousPartnerIndex] : null;
//
//   return (
//     <div id="employeeVals" className={`fade ${fade ? 'show' : ''}`}>
//       {/* Top Buttons Row 1 & 2 */}
//       <div className="topButtonArea">
//         <div className="topButtonRow">
//           <button onClick={() => setShowRestartModal(true)} id="reset">Restart</button>
//           <button onClick={prevEmployee} id="prevEmployeeBtn" disabled={employee <= 1}>
//             Back
//           </button>
//           <button onClick={handleLoadLastList} id="loadLastBtn">
//             Load Last List
//           </button>
//         </div>
//         <div className="topButtonRow">
//           <button onClick={handleDone} id="done" className="fullWidthBtn">
//             Done
//           </button>
//         </div>
//       </div>
//
//       {/* Previous Partner Visual Context */}
//       <div className="previousPartnerBadge">
//         {previousPartner ? (
//           <span>Prev (Partner {previousPartner.employeeNumber}): <strong>{previousPartner.hoursWorked} hrs</strong></span>
//         ) : (
//           <span>First partner entry</span>
//         )}
//       </div>
//
//       <div id="employeeText">
//         Hours for Partner <strong>{employee}</strong>:
//       </div>
//
//       <input
//         ref={inputRef}
//         type="text"
//         name="workedHoursDisplay"
//         id="hoursInput"
//         value={workedHoursStr || ''}
//         placeholder="0"
//         readOnly
//         className={`hours-display-input ${isHighlighted ? 'highlighted-input' : ''}`}
//       />
//
//       {/* Numpad */}
//       <div className="numpad">
//         <div className="numpad-row">
//           <button onClick={() => handleNumpadClick('1')}>1</button>
//           <button onClick={() => handleNumpadClick('2')}>2</button>
//           <button onClick={() => handleNumpadClick('3')}>3</button>
//         </div>
//         <div className="numpad-row">
//           <button onClick={() => handleNumpadClick('4')}>4</button>
//           <button onClick={() => handleNumpadClick('5')}>5</button>
//           <button onClick={() => handleNumpadClick('6')}>6</button>
//         </div>
//         <div className="numpad-row">
//           <button onClick={() => handleNumpadClick('7')}>7</button>
//           <button onClick={() => handleNumpadClick('8')}>8</button>
//           <button onClick={() => handleNumpadClick('9')}>9</button>
//         </div>
//         <div className="numpad-row">
//           <button onClick={() => handleNumpadClick('del')} id="deleteBtn">Del</button>
//           <button onClick={() => handleNumpadClick('0')}>0</button>
//           <button onClick={() => handleNumpadClick('.')} id="decimalBtn">.</button>
//         </div>
//         <div className="numpad-row">
//           <button onClick={handleEnter} id="enterBtn" className="numpad-enter-btn">Enter</button>
//         </div>
//       </div>
//
//       {/* Restart Modal Confirmation */}
//       {showRestartModal && (
//         <div className="modal-overlay">
//           <div className="modal-content">
//             <h3>Restart Calculation?</h3>
//             <p>This will erase all current entries and restart from Partner 1.</p>
//             <div className="modal-actions">
//               <button onClick={confirmReset} className="modal-confirm-btn">Yes, Restart</button>
//               <button onClick={() => setShowRestartModal(false)} className="modal-cancel-btn">Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
//
// export default Hours;


import { useState, useEffect } from 'react';
import './App.css';

function Hours({ onDone, onRestart, initialData = [], targetPartnerIndex = null }) {
  const [isCsvMode, setIsCsvMode] = useState(false);
  const [csvText, setCsvText] = useState('');

  const [employeeData, setEmployeeData] = useState(() => {
    if (initialData && initialData.length > 0) return initialData;
    const saved = localStorage.getItem('employeeData');
    return saved ? JSON.parse(saved) : [];
  });

  const [employee, setEmployees] = useState(() => {
    if (targetPartnerIndex !== null) return targetPartnerIndex + 1;
    const savedPartner = Number(localStorage.getItem('currentPartnerNumber'));
    if (savedPartner && savedPartner > 0) return savedPartner;
    const savedData = JSON.parse(localStorage.getItem('employeeData')) || [];
    return savedData.length > 0 ? savedData.length + 1 : 1;
  });

  const [workedHoursStr, setWorkedHoursStr] = useState(() => {
    const currentIdx = targetPartnerIndex !== null ? targetPartnerIndex : employee - 1;
    const savedData = JSON.parse(localStorage.getItem('employeeData')) || initialData;
    const existing = savedData[currentIdx];
    return existing && existing.hoursWorked !== undefined ? String(existing.hoursWorked) : '';
  });

  const [fade, setFade] = useState(true);
  const [isHighlighted, setIsHighlighted] = useState(targetPartnerIndex !== null);
  const [showRestartModal, setShowRestartModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('employeeData', JSON.stringify(employeeData));
    localStorage.setItem('currentPartnerNumber', String(employee));
    const calculatedTotal = employeeData.reduce((sum, item) => sum + (parseFloat(item.hoursWorked) || 0), 0);
    localStorage.setItem('totalHours', JSON.stringify(calculatedTotal));
  }, [employeeData, employee]);

  const transitionEmployee = (callback) => {
    setFade(false);
    setTimeout(() => {
      callback();
      setFade(true);
    }, 300);
  };

  const saveCurrentInputValue = (dataArr, partnerNum, valStr) => {
    const updated = [...dataArr];
    const idx = partnerNum - 1;
    const val = parseFloat(valStr) || 0;

    if (valStr.trim() !== '') {
      if (idx < updated.length) {
        updated[idx] = { ...updated[idx], hoursWorked: val };
      } else {
        updated.push({ employeeNumber: partnerNum, hoursWorked: val });
      }
    }
    return updated;
  };

  const handleEnter = () => {
    transitionEmployee(() => {
      const updatedData = saveCurrentInputValue(employeeData, employee, workedHoursStr);
      setEmployeeData(updatedData);

      const nextPartner = employee + 1;
      setEmployees(nextPartner);

      const nextIdx = nextPartner - 1;
      if (updatedData[nextIdx] && updatedData[nextIdx].hoursWorked !== undefined) {
        setWorkedHoursStr(String(updatedData[nextIdx].hoursWorked));
        setIsHighlighted(true);
      } else {
        setWorkedHoursStr('');
        setIsHighlighted(false);
      }
    });
  };

  const prevEmployee = () => {
    if (employee <= 1) return;
    transitionEmployee(() => {
      let updatedData = employeeData;
      if (workedHoursStr.trim() !== '') {
        updatedData = saveCurrentInputValue(employeeData, employee, workedHoursStr);
        setEmployeeData(updatedData);
      }

      const prevPartner = employee - 1;
      setEmployees(prevPartner);

      const prevIdx = prevPartner - 1;
      setWorkedHoursStr(
        updatedData[prevIdx] && updatedData[prevIdx].hoursWorked !== undefined
          ? String(updatedData[prevIdx].hoursWorked)
          : ''
      );
      setIsHighlighted(true);
    });
  };

  const handleDone = () => {
    let finalData = saveCurrentInputValue(employeeData, employee, workedHoursStr);

    if (finalData.length > 0) {
      const last = finalData[finalData.length - 1];
      if (last.hoursWorked === 0 && last.employeeNumber === employee && workedHoursStr.trim() === '') {
        finalData.pop();
      }
    }

    const finalTotalHours = finalData.reduce((sum, item) => sum + (item.hoursWorked || 0), 0);

    localStorage.setItem('lastSavedList', JSON.stringify(finalData));
    localStorage.setItem('lastSavedTotalHours', JSON.stringify(finalTotalHours));

    onDone(finalData, finalTotalHours);
  };

  const confirmReset = () => {
    setShowRestartModal(false);
    transitionEmployee(() => {
      setEmployeeData([]);
      setEmployees(1);
      setWorkedHoursStr('');
      setCsvText('');
      localStorage.removeItem('employeeData');
      localStorage.removeItem('totalHours');
      localStorage.removeItem('currentPartnerNumber');
      onRestart();
    });
  };

  const handleLoadLastList = () => {
    const backupData = JSON.parse(localStorage.getItem('lastSavedList')) || [];
    const backupHours = JSON.parse(localStorage.getItem('lastSavedTotalHours')) || 0;

    if (backupData.length === 0) {
      alert('No previously saved list found.');
      return;
    }

    setEmployeeData(backupData);
    setEmployees(1);
    setWorkedHoursStr(backupData[0]?.hoursWorked !== undefined ? String(backupData[0].hoursWorked) : '');
    setIsHighlighted(true);
  };

  // --- Robust CSV Line Parser (Quote-Aware) ---
  const parseCsvLine = (line) => {
    const fields = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    fields.push(current.trim().replace(/^["']|["']$/g, ''));
    return fields;
  };

  // --- Smart CSV Parser with Header & Metadata Filtering ---
  const parseCsvContent = (content) => {
    const lines = content.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const parsedData = [];

    const headerKeywords = [
      'store', 'partner', 'tippable', 'report', 'executed', 
      'disclaimer', 'number', 'hours', 'time period', 'home store'
    ];

    lines.forEach((line) => {
      const lowerLine = line.toLowerCase();
      // Skip obvious metadata / header rows
      if (headerKeywords.some((keyword) => lowerLine.includes(keyword) && !/\d+\.\d+/.test(line))) {
        return;
      }

      const fields = parseCsvLine(line);
      let name = '';
      let hours = 0;
      let partnerNumber = '';

      // Standard 4-column Starbucks Report: [Home Store, Partner Name, Partner Number, Total Tippable Hours]
      if (fields.length >= 4) {
        const candidateHours = parseFloat(fields[fields.length - 1]);
        if (!isNaN(candidateHours)) {
          hours = candidateHours;
          partnerNumber = fields[fields.length - 2];
          // Re-assemble name fields if extra unquoted commas split the name
          name = fields.slice(1, fields.length - 2).join(', ');
        }
      } else if (fields.length === 3) {
        const candidateHours = parseFloat(fields[2]);
        if (!isNaN(candidateHours)) {
          hours = candidateHours;
          name = fields[0];
          partnerNumber = fields[1];
        }
      } else if (fields.length === 2) {
        const candidateHours = parseFloat(fields[1]);
        if (!isNaN(candidateHours)) {
          hours = candidateHours;
          name = fields[0];
        }
      } else if (fields.length === 1) {
        const candidateHours = parseFloat(fields[0]);
        if (!isNaN(candidateHours)) {
          hours = candidateHours;
        }
      }

      // Cleanup residual quotes and ignore headers parsed as text
      name = name.replace(/^["']|["']$/g, '').trim();
      if (name.toLowerCase() === 'partner name' || name.toLowerCase() === 'name') return;

      if (hours > 0 || name.length > 0) {
        parsedData.push({
          employeeNumber: parsedData.length + 1,
          name: name || `Partner ${parsedData.length + 1}`,
          partnerNumber,
          hoursWorked: hours,
        });
      }
    });

    if (parsedData.length > 0) {
      setEmployeeData(parsedData);
      const newTotalHours = parsedData.reduce((sum, p) => sum + p.hoursWorked, 0);
      localStorage.setItem('employeeData', JSON.stringify(parsedData));
      localStorage.setItem('totalHours', JSON.stringify(newTotalHours));
      localStorage.setItem('lastSavedList', JSON.stringify(parsedData));
      localStorage.setItem('lastSavedTotalHours', JSON.stringify(newTotalHours));
      onDone(parsedData, newTotalHours);
    } else {
      alert('Could not parse valid partner data from CSV. Please check format.');
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setCsvText(content);
      parseCsvContent(content);
    };
    reader.readAsText(file);
  };

  const handleNumpadClick = (value) => {
    let currentStr = workedHoursStr;

    if (isHighlighted) {
      currentStr = '';
      setIsHighlighted(false);
    }

    if (value === 'del') {
      setWorkedHoursStr(currentStr.slice(0, -1));
      return;
    }

    if (value === '.') {
      if (!currentStr.includes('.')) {
        setWorkedHoursStr((currentStr === '' ? '0' : currentStr) + '.');
      }
      return;
    }

    let nextStr = currentStr === '0' ? value : currentStr + value;

    if (!nextStr.includes('.') && nextStr.length === 2) {
      nextStr += '.';
    }

    setWorkedHoursStr(nextStr);
  };

  const currentPartnerData = employeeData[employee - 1];
  const displayName = currentPartnerData?.name || `Partner ${employee}`;

  const previousPartnerIndex = employee - 2;
  const previousPartner = previousPartnerIndex >= 0 ? employeeData[previousPartnerIndex] : null;

  return (
    <div id="employeeVals" className={`fade ${fade ? 'show' : ''}`}>
      <div className="mode-toggle-area">
        <button className="mode-toggle-btn" onClick={() => setIsCsvMode(!isCsvMode)}>
          Switch to {isCsvMode ? 'Manual Numpad Mode' : 'CSV Import Mode'}
        </button>
      </div>

      {!isCsvMode ? (
        <>
          <div className="previousPartnerBadge">
            {previousPartner ? (
              <span>
                Prev ({previousPartner.name || `Partner ${previousPartner.employeeNumber}`}):{' '}
                <strong>{Number(previousPartner.hoursWorked).toFixed(2)} hrs</strong>
              </span>
            ) : (
              <span>First partner entry</span>
            )}
          </div>

          <div id="employeeText">
            Hours for <strong>{displayName}</strong>:
          </div>

          <input
            type="text"
            name="workedHoursDisplay"
            id="hoursInput"
            value={workedHoursStr || ''}
            placeholder="0"
            readOnly
            className={`hours-display-input ${isHighlighted ? 'highlighted-input' : ''}`}
          />

          <div className="numpad">
            <div className="numpad-row">
              <button onClick={() => handleNumpadClick('1')}>1</button>
              <button onClick={() => handleNumpadClick('2')}>2</button>
              <button onClick={() => handleNumpadClick('3')}>3</button>
            </div>
            <div className="numpad-row">
              <button onClick={() => handleNumpadClick('4')}>4</button>
              <button onClick={() => handleNumpadClick('5')}>5</button>
              <button onClick={() => handleNumpadClick('6')}>6</button>
            </div>
            <div className="numpad-row">
              <button onClick={() => handleNumpadClick('7')}>7</button>
              <button onClick={() => handleNumpadClick('8')}>8</button>
              <button onClick={() => handleNumpadClick('9')}>9</button>
            </div>
            <div className="numpad-row">
              <button onClick={() => handleNumpadClick('del')} id="deleteBtn">
                Del
              </button>
              <button onClick={() => handleNumpadClick('0')}>0</button>
              <button onClick={() => handleNumpadClick('.')} id="decimalBtn">
                .
              </button>
            </div>
            <div className="numpad-row">
              <button onClick={handleEnter} id="enterBtn" className="numpad-enter-btn">
                Enter
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="csv-container">
          <p style={{ color: 'black', margin: '0.5em 0' }}>
            Paste report text / CSV or upload file:
          </p>
          <textarea
            className="csv-textarea"
            placeholder={`Avery, Avery Vanessa A, US2863767, 37.32\nBaten, Danny, US37149371, 24.18`}
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
          />
          <input type="file" accept=".csv, .txt" onChange={handleFileUpload} className="csv-file-input" />
          <button className="csv-import-btn" onClick={() => parseCsvContent(csvText)}>
            Import & Process Report
          </button>
        </div>
      )}

      <div className="bottomButtonArea">
        <div className="bottomButtonRow">
          <button onClick={() => setShowRestartModal(true)} id="reset">
            Restart
          </button>
          <button onClick={prevEmployee} id="prevEmployeeBtn" disabled={employee <= 1 || isCsvMode}>
            Back
          </button>
          <button onClick={handleLoadLastList} id="loadLastBtn">
            Load Last List
          </button>
        </div>
        <div className="bottomButtonRow">
          <button onClick={handleDone} id="done" className="fullWidthBtn">
            Done
          </button>
        </div>
      </div>

      {showRestartModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Restart Calculation?</h3>
            <p>This will erase all current entries and restart from Partner 1.</p>
            <div className="modal-actions">
              <button onClick={confirmReset} className="modal-confirm-btn">
                Yes, Restart
              </button>
              <button onClick={() => setShowRestartModal(false)} className="modal-cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hours;
