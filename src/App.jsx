import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './Navbar.jsx';
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
  const [roundingSettings, setRoundingSettings] = useState(() => JSON.parse(localStorage.getItem('roundingSettings')) || {});
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [editingPartnerIndex, setEditingPartnerIndex] = useState(null);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('step', step);
    localStorage.setItem('employeeData', JSON.stringify(employeeData));
    localStorage.setItem('totalHours', totalHours);
    localStorage.setItem('totalTips', totalTips);
    localStorage.setItem('roundingSettings', JSON.stringify(roundingSettings));
  }, [step, employeeData, totalHours, totalTips, roundingSettings]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

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
    triggerStepChange(2);
  };

  const handleConfirmSummary = () => triggerStepChange(3);

  const handleConfirmTally = (calculatedTips) => {
    setTotalTips(calculatedTips);
    triggerStepChange(4);
  };

  const handleEditPartnerFromSummary = (index) => {
    setEditingPartnerIndex(index);
    triggerStepChange(1);
  };

  const handleDoneInRounding = (data, tips, settings) => {
    setEmployeeData(data);
    setTotalTips(tips);
    if (settings) setRoundingSettings(settings);
    triggerStepChange(5);
  };

  const handleRestart = () => {
    const lastSavedList = localStorage.getItem('lastSavedList');
    const lastSavedTotalHours = localStorage.getItem('lastSavedTotalHours');

    setStep(1);
    setEmployeeData([]);
    setTotalHours(0);
    setTotalTips(0);
    setRoundingSettings({});
    setEditingPartnerIndex(null);

    localStorage.clear();

    if (lastSavedList) localStorage.setItem('lastSavedList', lastSavedList);
    if (lastSavedTotalHours) localStorage.setItem('lastSavedTotalHours', lastSavedTotalHours);

    triggerStepChange(1);
  };

  return (
    <div id="mainContainer">
      <Navbar
        currentStep={step}
        onNavigateStep={triggerStepChange}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

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
            onReturnToTipCounter={() => triggerStepChange(3)}
          />
        )}

        {step === 5 && (
          <Results
            employeeData={employeeData}
            totalHours={totalHours}
            totalTips={totalTips}
            roundingSettings={roundingSettings}
            onRestart={handleRestart}
            onReturnToRounding={() => triggerStepChange(4)}
            onReturnToTipCounter={() => triggerStepChange(3)}
            onReturnToEdit={() => triggerStepChange(2)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
