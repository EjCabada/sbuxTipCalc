// // export default App;
//
// import { useState, useEffect } from 'react';
// import './App.css';
// import Hours from './hours.jsx';
// import Summary from './Summary.jsx';
// import Rounding from './Rounding.jsx';
// import Results from './Results.jsx';
//
// function App() {
//   const [step, setStep] = useState(() => Number(localStorage.getItem('step')) || 1);
//   const [employeeData, setEmployeeData] = useState(() => JSON.parse(localStorage.getItem('employeeData')) || []);
//   const [totalHours, setTotalHours] = useState(() => Number(localStorage.getItem('totalHours')) || 0);
//   const [totalTips, setTotalTips] = useState(() => Number(localStorage.getItem('totalTips')) || 0);
//   const [editingPartnerIndex, setEditingPartnerIndex] = useState(null);
//   const [fade, setFade] = useState(true);
//
//   useEffect(() => {
//     localStorage.setItem('step', step);
//     localStorage.setItem('employeeData', JSON.stringify(employeeData));
//     localStorage.setItem('totalHours', totalHours);
//     localStorage.setItem('totalTips', totalTips);
//   }, [step, employeeData, totalHours, totalTips]);
//
//   const triggerStepChange = (newStep) => {
//     setFade(false);
//     setTimeout(() => {
//       setStep(newStep);
//       setFade(true);
//     }, 300);
//   };
//
//   const handleDoneInHours = (data, hours) => {
//     setEmployeeData(data);
//     setTotalHours(hours);
//     setEditingPartnerIndex(null);
//     triggerStepChange(2);
//   };
//
//   const handleConfirmSummary = () => {
//     triggerStepChange(3);
//   };
//
//   const handleEditPartnerFromSummary = (index) => {
//     setEditingPartnerIndex(index);
//     triggerStepChange(1);
//   };
//
//   const handleDoneInRounding = (data, tips) => {
//     setEmployeeData(data);
//     setTotalTips(tips);
//     triggerStepChange(4);
//   };
//
//   const handleRestart = () => {
//     setStep(1);
//     setEmployeeData([]);
//     setTotalHours(0);
//     setTotalTips(0);
//     setEditingPartnerIndex(null);
//     localStorage.clear();
//     triggerStepChange(1);
//   };
//
//   const handleReturnToRounding = () => {
//     triggerStepChange(3);
//   };
//
//   return (
//     <div id="mainContainer">
//       <div id="app" className={`fade ${fade ? 'show' : ''}`}>
//         <h1>TIP CALCULATOR</h1>
//
//         {step === 1 && (
//           <Hours
//             onDone={handleDoneInHours}
//             onRestart={handleRestart}
//             initialData={employeeData}
//             targetPartnerIndex={editingPartnerIndex}
//           />
//         )}
//
//         {step === 2 && (
//           <Summary
//             employeeData={employeeData}
//             onConfirm={handleConfirmSummary}
//             onEditPartner={handleEditPartnerFromSummary}
//             onBackToInput={() => triggerStepChange(1)}
//           />
//         )}
//
//         {step === 3 && <Rounding employeeData={employeeData} onDone={handleDoneInRounding} />}
//
//         {step === 4 && (
//           <Results
//             employeeData={employeeData}
//             totalHours={totalHours}
//             totalTips={totalTips}
//             onRestart={handleRestart}
//             onReturnToRounding={handleReturnToRounding}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
//
// export default App;

import { useState, useEffect } from 'react';
import './App.css';
import Hours from './hours.jsx';
import Summary from './Summary.jsx';
import TipCounter from './TipCounter.jsx';
import Rounding from './Rounding.jsx';
import Results from './Results.jsx';

function App() {
  const [step, setStep] = useState(() => Number(localStorage.getItem('step')) || 1);
  const [employeeData, setEmployeeData] = useState(() => JSON.parse(localStorage.getItem('employeeData')) || []);
  const [totalHours, setTotalHours] = useState(() => Number(localStorage.getItem('totalHours')) || 0);
  const [totalTips, setTotalTips] = useState(() => Number(localStorage.getItem('totalTips')) || 0);
  const [editingPartnerIndex, setEditingPartnerIndex] = useState(null);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    localStorage.setItem('step', step);
    localStorage.setItem('employeeData', JSON.stringify(employeeData));
    localStorage.setItem('totalHours', totalHours);
    localStorage.setItem('totalTips', totalTips);
  }, [step, employeeData, totalHours, totalTips]);

  const triggerStepChange = (newStep) => {
    setFade(false);
    setTimeout(() => {
      setStep(newStep);
      setFade(true);
    }, 300);
  };

  const handleDoneInHours = (data, hours) => {
    setEmployeeData(data);
    setTotalHours(hours);
    setEditingPartnerIndex(null);
    triggerStepChange(2); // Step 2: Summary
  };

  const handleConfirmSummary = () => {
    triggerStepChange(3); // Step 3: Tip Tally Counter
  };

  const handleConfirmTally = (calculatedTips) => {
    setTotalTips(calculatedTips);
    triggerStepChange(4); // Step 4: Rounding
  };

  const handleEditPartnerFromSummary = (index) => {
    setEditingPartnerIndex(index);
    triggerStepChange(1);
  };

  const handleDoneInRounding = (data, tips) => {
    setEmployeeData(data);
    setTotalTips(tips);
    triggerStepChange(5); // Step 5: Results
  };

  const handleRestart = () => {
    const lastSavedList = localStorage.getItem('lastSavedList');
    const lastSavedTotalHours = localStorage.getItem('lastSavedTotalHours');

    setStep(1);
    setEmployeeData([]);
    setTotalHours(0);
    setTotalTips(0);
    setEditingPartnerIndex(null);

    localStorage.clear();

    if (lastSavedList) localStorage.setItem('lastSavedList', lastSavedList);
    if (lastSavedTotalHours) localStorage.setItem('lastSavedTotalHours', lastSavedTotalHours);

    triggerStepChange(1);
  };

  const handleReturnToRounding = () => triggerStepChange(4);
  const handleReturnToTipCounter = () => triggerStepChange(3);
  const handleReturnToEdit = () => triggerStepChange(2);

  return (
    <div id="mainContainer">
      <div id="app" className={`fade ${fade ? 'show' : ''}`}>
        <h1>TIP CALCULATOR</h1>

        {step === 1 && (
          <Hours
            onDone={handleDoneInHours}
            onRestart={handleRestart}
            initialData={employeeData}
            targetPartnerIndex={editingPartnerIndex}
          />
        )}

        {step === 2 && (
          <Summary
            employeeData={employeeData}
            onConfirm={handleConfirmSummary}
            onEditPartner={handleEditPartnerFromSummary}
            onBackToInput={() => triggerStepChange(1)}
          />
        )}

        {step === 3 && (
          <TipCounter
            initialTotalTips={totalTips}
            onConfirmTally={handleConfirmTally}
            onBackToSummary={() => triggerStepChange(2)}
          />
        )}

        {step === 4 && (
          <Rounding
            employeeData={employeeData}
            totalTips={totalTips}
            onDone={handleDoneInRounding}
            onReturnToTipCounter={handleReturnToTipCounter}
          />
        )}

        {step === 5 && (
          <Results
            employeeData={employeeData}
            totalHours={totalHours}
            totalTips={totalTips}
            onRestart={handleRestart}
            onReturnToRounding={handleReturnToRounding}
            onReturnToTipCounter={handleReturnToTipCounter}
            onReturnToEdit={handleReturnToEdit}
          />
        )}
      </div>
    </div>
  );
}

export default App;
