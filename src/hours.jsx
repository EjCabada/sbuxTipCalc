import { useState, useEffect, useRef } from 'react';
import './App.css'; // Assuming your styles are here

function Hours({ onDone, onRestart, initialData = [], initialTotalHours = 0 }) {
  const [employee, setEmployees] = useState(initialData.length + 1);
  const [workedHoursStr, setWorkedHoursStr] = useState('');
  const [employeeData, setEmployeeData] = useState(initialData);
  const [totalHours, setTotalHours] = useState(initialTotalHours);
  const [fade, setFade] = useState(true);
  const inputRef = useRef(null);

  const getWorkedHours = () => parseFloat(workedHoursStr) || 0;

  useEffect(() => {
    const dataToLoad = initialData.length > 0 ? initialData : JSON.parse(localStorage.getItem('employeeData')) || [];
    const hoursToLoad = initialData.length > 0 ? initialTotalHours : JSON.parse(localStorage.getItem('totalHours')) || 0;

    setEmployeeData(dataToLoad);
    setTotalHours(hoursToLoad);

    const currentEmployeeIndex = employee - 1;
    if (dataToLoad[currentEmployeeIndex]) {
      setWorkedHoursStr(String(dataToLoad[currentEmployeeIndex].hoursWorked || ''));
    } else {
      setWorkedHoursStr('');
    }

    if (inputRef.current) {
      // inputRef.current.focus();
    }
  }, [initialData, initialTotalHours]);

  useEffect(() => {
    if (employeeData.length > 0 || totalHours >= 0) { // change to >= 0
      localStorage.setItem('employeeData', JSON.stringify(employeeData));
      localStorage.setItem('totalHours', JSON.stringify(totalHours));
    }
  }, [employeeData, totalHours]);

  const transitionEmployee = (callback) => {
    setFade(false);
    setTimeout(() => {
      callback();
      setFade(true);
      if (inputRef.current) {
        // inputRef.current.focus();
      }
    }, 300);
  };

  const updateOrAddEmployeeData = (hoursValue) => {
    let updatedData = [...employeeData];
    let newTotalHours = totalHours;
    const currentEmployeeIndex = employee - 1;

    if (currentEmployeeIndex < updatedData.length) {
      const oldHours = updatedData[currentEmployeeIndex].hoursWorked || 0;
      const difference = hoursValue - oldHours;
      updatedData[currentEmployeeIndex].hoursWorked = hoursValue;
      newTotalHours += difference;
    } else {
      updatedData.push({ employeeNumber: employee, hoursWorked: hoursValue });
      newTotalHours += hoursValue;
    }

    setEmployeeData(updatedData);
    setTotalHours(newTotalHours);
    return { updatedData, newTotalHours, addedOrUpdated: true };
  };

  const handleEnter = () => {
    const currentHours = getWorkedHours();

    transitionEmployee(() => {
      const { addedOrUpdated } = updateOrAddEmployeeData(currentHours);

      if (addedOrUpdated) {
        setEmployees(employee + 1);
        const nextEmployeeIndex = employee;
        if (employeeData[nextEmployeeIndex]) {
          setWorkedHoursStr(String(employeeData[nextEmployeeIndex].hoursWorked || ''));
        } else {
          setWorkedHoursStr('');
        }
      } else {
        setWorkedHoursStr('');
      }
    });
  };

  const prevEmployee = () => {
    const currentHours = getWorkedHours();
    updateOrAddEmployeeData(currentHours);

    transitionEmployee(() => {
      if (employee > 1) {
        const previousEmployeeIndex = employee - 2;
        setEmployees(employee - 1);
        setWorkedHoursStr(String(employeeData[previousEmployeeIndex]?.hoursWorked || ''));
      }
    });
  };

  const handleDone = () => {
    const currentHours = getWorkedHours();
    let finalData = [...employeeData];
    let finalTotalHours = totalHours;

    const currentEmployeeIndex = employee - 1;
    if (currentEmployeeIndex < finalData.length) {
      const oldHours = finalData[currentEmployeeIndex].hoursWorked || 0;
      finalData[currentEmployeeIndex].hoursWorked = currentHours;
      finalTotalHours = totalHours - oldHours + currentHours;
    } else {
      finalData.push({ employeeNumber: employee, hoursWorked: currentHours });
      finalTotalHours = totalHours + currentHours;
    }

    onDone(finalData, finalTotalHours);
  };

  const handleReset = () => {
    transitionEmployee(() => {
      setEmployeeData([]);
      setTotalHours(0);
      setEmployees(1);
      setWorkedHoursStr('');
      localStorage.removeItem('employeeData');
      localStorage.removeItem('totalHours');
      onRestart();
    });
  };

  const handleNumpadClick = (value) => {
    if (value === 'del') {
      setWorkedHoursStr((prev) => prev.slice(0, -1));
    } else if (value === '.') {
      if (!workedHoursStr.includes('.')) {
        setWorkedHoursStr((prev) => (prev === '' ? '0' : prev) + '.');
      }
    } else {
      if (workedHoursStr === '0' && value !== '.') {
        setWorkedHoursStr(value);
      } else {
        setWorkedHoursStr((prev) => prev + value);
      }
    }
  };

  const TopButtons = () => (
    <div className="topButtonArea">
      <button onClick={prevEmployee} id="prevEmployeeBtn" disabled={employee <= 1}>
        Back
      </button>
      <button onClick={handleDone} id="done">Done</button>
      <button onClick={handleReset} id="reset">Restart</button>
    </div>
  );

  const Numpad = () => (
    <div className="numpad">
      {/* ... (Numpad buttons) */}
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
        <button onClick={() => handleNumpadClick('del')} id="deleteBtn">Del</button>
        <button onClick={() => handleNumpadClick('0')}>0</button>
        <button onClick={() => handleNumpadClick('.')} id="decimalBtn">.</button>
      </div>
      <div className="numpad-row">
        <button onClick={handleEnter} id="enterBtn" className="numpad-enter-btn">Enter</button>
      </div>
    </div>
  );

  return (
    <div id="employeeVals" className={`fade ${fade ? 'show' : ''}`}>
      <div id="employeeText">
        Hours for Partner <strong>{employee}</strong>:
      </div>
      <input
        ref={inputRef}
        type="text"
        name="workedHoursDisplay"
        id="hoursInput"
        value={workedHoursStr || ''}
        placeholder="0"
        readOnly
        className="hours-display-input"
      />
      <Numpad />
      <TopButtons />
    </div>
  );
}

export default Hours;