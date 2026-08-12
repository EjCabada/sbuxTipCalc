// import { useState, useEffect, useRef } from 'react';
// import './App.css'; // Assuming your styles are here
//
// function Hours({ onDone, onRestart, initialData = [], initialTotalHours = 0 }) {
//   const [employee, setEmployees] = useState(initialData.length + 1);
//   const [workedHoursStr, setWorkedHoursStr] = useState('');
//   const [employeeData, setEmployeeData] = useState(initialData);
//   const [totalHours, setTotalHours] = useState(initialTotalHours);
//   const [fade, setFade] = useState(true);
//   const inputRef = useRef(null);
//
//   const getWorkedHours = () => parseFloat(workedHoursStr) || 0;
//
//   useEffect(() => {
//     const dataToLoad = initialData.length > 0 ? initialData : JSON.parse(localStorage.getItem('employeeData')) || [];
//     const hoursToLoad = initialData.length > 0 ? initialTotalHours : JSON.parse(localStorage.getItem('totalHours')) || 0;
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
//
//     if (inputRef.current) {
//       // inputRef.current.focus();
//     }
//   }, [initialData, initialTotalHours]);
//
//   useEffect(() => {
//     if (employeeData.length > 0 || totalHours >= 0) { // change to >= 0
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
//       if (inputRef.current) {
//         // inputRef.current.focus();
//       }
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
//
//     transitionEmployee(() => {
//       const { addedOrUpdated } = updateOrAddEmployeeData(currentHours);
//
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
//     });
//   };
//
//   const prevEmployee = () => {
//     const currentHours = getWorkedHours();
//     updateOrAddEmployeeData(currentHours);
//
//     transitionEmployee(() => {
//       if (employee > 1) {
//         const previousEmployeeIndex = employee - 2;
//         setEmployees(employee - 1);
//         setWorkedHoursStr(String(employeeData[previousEmployeeIndex]?.hoursWorked || ''));
//       }
//     });
//   };
//
//   const handleDone = () => {
//     const currentHours = getWorkedHours();
//     let finalData = [...employeeData];
//     let finalTotalHours = totalHours;
//
//     const currentEmployeeIndex = employee - 1;
//     if (currentEmployeeIndex < finalData.length) {
//       const oldHours = finalData[currentEmployeeIndex].hoursWorked || 0;
//       finalData[currentEmployeeIndex].hoursWorked = currentHours;
//       finalTotalHours = totalHours - oldHours + currentHours;
//     } else {
//       finalData.push({ employeeNumber: employee, hoursWorked: currentHours });
//       finalTotalHours = totalHours + currentHours;
//     }
//
//     onDone(finalData, finalTotalHours);
//   };
//
//   const handleReset = () => {
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
//   const handleNumpadClick = (value) => {
//     if (value === 'del') {
//       setWorkedHoursStr((prev) => prev.slice(0, -1));
//     } else if (value === '.') {
//       if (!workedHoursStr.includes('.')) {
//         setWorkedHoursStr((prev) => (prev === '' ? '0' : prev) + '.');
//       }
//     } else {
//       if (workedHoursStr === '0' && value !== '.') {
//         setWorkedHoursStr(value);
//       } else {
//         setWorkedHoursStr((prev) => prev + value);
//       }
//     }
//   };
//
//   const TopButtons = () => (
//     <div className="topButtonArea">
//       <button onClick={handleReset} id="reset">Restart</button>
//       <button onClick={prevEmployee} id="prevEmployeeBtn" disabled={employee <= 1}>
//         Back
//       </button>
//       <button onClick={handleDone} id="done">Done</button>
//     </div>
//   );
//
//   const Numpad = () => (
//     <div className="numpad">
//       {/* ... (Numpad buttons) */}
//       <div className="numpad-row">
//         <button onClick={() => handleNumpadClick('1')}>1</button>
//         <button onClick={() => handleNumpadClick('2')}>2</button>
//         <button onClick={() => handleNumpadClick('3')}>3</button>
//       </div>
//       <div className="numpad-row">
//         <button onClick={() => handleNumpadClick('4')}>4</button>
//         <button onClick={() => handleNumpadClick('5')}>5</button>
//         <button onClick={() => handleNumpadClick('6')}>6</button>
//       </div>
//       <div className="numpad-row">
//         <button onClick={() => handleNumpadClick('7')}>7</button>
//         <button onClick={() => handleNumpadClick('8')}>8</button>
//         <button onClick={() => handleNumpadClick('9')}>9</button>
//       </div>
//       <div className="numpad-row">
//         <button onClick={() => handleNumpadClick('del')} id="deleteBtn">Del</button>
//         <button onClick={() => handleNumpadClick('0')}>0</button>
//         <button onClick={() => handleNumpadClick('.')} id="decimalBtn">.</button>
//       </div>
//       <div className="numpad-row">
//         <button onClick={handleEnter} id="enterBtn" className="numpad-enter-btn">Enter</button>
//       </div>
//     </div>
//   );
//
//   return (
//     <div id="employeeVals" className={`fade ${fade ? 'show' : ''}`}>
//       <div id="employeeText">
//         (Exact or Rounding) Hours for Partner <strong>{employee}</strong>:
//       </div>
//       <input
//         ref={inputRef}
//         type="text"
//         name="workedHoursDisplay"
//         id="hoursInput"
//         value={workedHoursStr || ''}
//         placeholder="0"
//         readOnly
//         className="hours-display-input"
//       />
//       <Numpad />
//       <TopButtons />
//     </div>
//   );
// }
//
// export default Hours;

import { useState, useEffect } from 'react';
import './App.css';

function Hours({ onDone, onRestart, initialData = [], targetPartnerIndex = null }) {
  // Initialize employeeData from initialData or localStorage
  const [employeeData, setEmployeeData] = useState(() => {
    if (initialData && initialData.length > 0) return initialData;
    const saved = localStorage.getItem('employeeData');
    return saved ? JSON.parse(saved) : [];
  });

  // Determine starting partner number
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

  // Sync state to localStorage on every update
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

    // Filter out trailing newly-added partner if hours are 0/empty
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

  const previousPartnerIndex = employee - 2;
  const previousPartner = previousPartnerIndex >= 0 ? employeeData[previousPartnerIndex] : null;

  return (
    <div id="employeeVals" className={`fade ${fade ? 'show' : ''}`}>
      {/* Previous Partner Badge */}
      <div className="previousPartnerBadge">
        {previousPartner ? (
          <span>
            Prev (Partner {previousPartner.employeeNumber}): <strong>{previousPartner.hoursWorked} hrs</strong>
          </span>
        ) : (
          <span>First partner entry</span>
        )}
      </div>

      <div id="employeeText">
        Hours for Partner <strong>{employee}</strong>:
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

      {/* Numpad */}
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

      {/* Action Buttons (Positioned Below Numpad) */}
      <div className="bottomButtonArea">
        <div className="bottomButtonRow">
          <button onClick={() => setShowRestartModal(true)} id="reset">
            Restart
          </button>
          <button onClick={prevEmployee} id="prevEmployeeBtn" disabled={employee <= 1}>
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

      {/* Restart Modal */}
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
