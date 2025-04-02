import React, { useState, useEffect } from 'react';

function Rounding({ employeeData, onDone }) {
  const [totalTips, setTotalTips] = useState(0);
  const [step, setStep] = useState(1); // Step 1: Hours rounding, Step 2: Total tips, Step 3: Tips rounding
  const [roundingOption, setRoundingOption] = useState('exact');

  const handleTipsChange = (event) => {
    setTotalTips(Number(event.target.value));
  };

  const applyHoursRounding = (option) => {
    setRoundingOption(option);
    setStep(2); // Proceed to Step 2
  };

  const proceedToTipsRounding = () => {
    if (totalTips <= 0) {
      alert('Please enter a valid total tips amount greater than 0.');
      return;
    }
    setStep(3); // Proceed to Step 3
  };

  const applyTipsRounding = (tipRoundingOption) => {
    let adjustedData = employeeData.map((emp) => {
      let adjustedHours = emp.hoursWorked;

      // Round hours based on the selected option
      if (roundingOption === 'up') {
        adjustedHours = Math.ceil(emp.hoursWorked);
      } else if (roundingOption === 'down') {
        adjustedHours = Math.floor(emp.hoursWorked);
      } else if (roundingOption === 'nearest') {
        adjustedHours = Math.round(emp.hoursWorked);
      }

      return {
        ...emp,
        adjustedHours,
      };
    });

    const totalAdjustedHours = adjustedData.reduce((sum, emp) => sum + emp.adjustedHours, 0);

    adjustedData = adjustedData.map((emp) => {
      const exactTips = (totalTips * emp.adjustedHours) / totalAdjustedHours;
      let roundedTips = exactTips;

      // Round tips based on the selected option
      if (tipRoundingOption === 'up') {
        roundedTips = Math.ceil(exactTips);
      } else if (tipRoundingOption === 'nearest') {
        roundedTips = Math.round(exactTips);
      }

      return {
        ...emp,
        exactTips,
        roundedTips,
      };
    });

    onDone(adjustedData, totalTips);
  };

  return (
    <div>
      <div className="status">
      <div className='progress-name'>
      <div className={`step2 ${step >= 1 ? 'active2' : 'nonActive'}`}>Partner Hours Worked</div>
      <div className='step2'>x</div>
        <div className={`step2 ${step >= 2 ? 'active2' : 'nonActive'}`}>Tips per Hour</div>
        <div className='step2'>=</div>
        <div className={`step2 ${step >= 3 ? 'active2' : 'nonActive'}`}>Final Tips Earned</div> 
      </div>
      <div className="progress-bar">
        <div className={`step ${step >= 1 ? 'active' : ''}`}></div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}></div> 
        <div className="progress" style={{ width: `${(step / 3) * 100}%` }}></div>
      </div>
      </div>

      {step === 1 && (
        <div className={`fade ${step === 1 ? 'show' : ''}`}>
          <p>Would you like to round every Partners hours worked (before multiplying by hourly tips)?</p>
          <button onClick={() => applyHoursRounding('up')}>Round Up</button>
          <button onClick={() => applyHoursRounding('down')}>Round Down</button>
          <button onClick={() => applyHoursRounding('nearest')}>Round to Nearest</button>
          <button onClick={() => applyHoursRounding('exact')}>Keep Exact</button>
        </div>
      )}

      {step === 2 && (
        <div  className={`fade ${step === 2 ? 'show' : ''}`}>
          <p>Enter <strong>exact</strong> total tips for the Week</p>
          <div className="column">
          <input
            type="number"
            inputMode="decimal"
            onChange={handleTipsChange}
            min="0"
          />
          <button onClick={proceedToTipsRounding}>Next</button>
          </div>

        </div>
      )}

      {step === 3 && (
        <div  className={`fade ${step === 3? 'show' : ''}`}>
          <p>Round final Partner earned tips (after multiplying by hourly tips earned)?</p>
          <button onClick={() => applyTipsRounding('up')}>Round Up</button>
          <button onClick={() => applyTipsRounding('nearest')}>Round to Nearest</button>
          <button onClick={() => applyTipsRounding('exact')}>Don't Round</button>
        </div>
      )}
    </div>
  );
}

export default Rounding;
