import React, { useState } from 'react';

function Rounding({ employeeData, totalTips, onDone, onReturnToTipCounter }) {
  const [step, setStep] = useState(1);
  const [roundingOption, setRoundingOption] = useState('exact');
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingResults, setPendingResults] = useState(null);

  const applyHoursRounding = (option) => {
    setRoundingOption(option);
    setStep(2);
  };

  const applyTipsRounding = (tipRoundingOption) => {
    let adjustedData = employeeData.map((emp) => {
      let adjustedHours = emp.hoursWorked;
      if (roundingOption === 'up') {
        adjustedHours = Math.ceil(emp.hoursWorked);
      } else if (roundingOption === 'down') {
        adjustedHours = Math.floor(emp.hoursWorked);
      } else if (roundingOption === 'nearest') {
        adjustedHours = Math.round(emp.hoursWorked);
      }
      return { ...emp, adjustedHours };
    });

    const totalAdjustedHours = adjustedData.reduce((sum, emp) => sum + emp.adjustedHours, 0);

    adjustedData = adjustedData.map((emp) => {
      const exactTips = totalAdjustedHours > 0 ? (totalTips * emp.adjustedHours) / totalAdjustedHours : 0;
      let roundedTips = exactTips;
      if (tipRoundingOption === 'up') {
        roundedTips = Math.ceil(exactTips);
      } else if (tipRoundingOption === 'nearest') {
        roundedTips = Math.round(exactTips);
      }
      return { ...emp, exactTips, roundedTips };
    });

    const settingsUsed = {
      hoursRounding: roundingOption,
      tipsRounding: tipRoundingOption,
    };

    localStorage.setItem('roundingSettings', JSON.stringify(settingsUsed));

    const distributedTipsTotal = adjustedData.reduce((sum, emp) => sum + emp.roundedTips, 0);

    if (distributedTipsTotal > totalTips) {
      setPendingResults({ adjustedData, totalTips, distributedTipsTotal, settingsUsed });
      setShowWarningModal(true);
    } else {
      onDone(adjustedData, totalTips, settingsUsed);
    }
  };

  const handleConfirmWarning = () => {
    if (pendingResults) {
      onDone(pendingResults.adjustedData, pendingResults.totalTips, pendingResults.settingsUsed);
    }
  };

  return (
    <div>
      <div className="tally-summary-badge">
        <span>Total Tips Counted: <strong>${totalTips.toFixed(2)}</strong></span>
        <button onClick={onReturnToTipCounter} className="adjust-tally-btn">
          Adjust Tally
        </button>
      </div>

      <div className="status">
        <div className="progress-name">
          <div className={`step2 ${step >= 1 ? 'active2' : 'nonActive'}`}>Hours Rounding</div>
          <div className="step2">➜</div>
          <div className={`step2 ${step >= 2 ? 'active2' : 'nonActive'}`}>Tips Rounding</div>
        </div>
        <div className="progress-bar">
          <div className={`step ${step >= 1 ? 'active' : ''}`}></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}></div>
          <div className="progress" style={{ width: `${(step / 2) * 100}%` }}></div>
        </div>
      </div>

      {step === 1 && (
        <div className={`fade ${step === 1 ? 'show' : ''}`}>
          <p>Would you like to round all Partner hours worked?</p>
          <button onClick={() => applyHoursRounding('nearest')}>Round to Nearest</button>
          <button onClick={() => applyHoursRounding('exact')}>Keep Exact</button>
        </div>
      )}

      {step === 2 && (
        <div className={`fade ${step === 2 ? 'show' : ''}`}>
          <p>Round final Partner earned tips?</p>
          <button onClick={() => applyTipsRounding('up')}>Round Up</button>
          <button onClick={() => applyTipsRounding('nearest')}>Round to Nearest</button>
          <button onClick={() => applyTipsRounding('exact')}>Don't Round</button>
        </div>
      )}

      {showWarningModal && pendingResults && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="warning-modal-header">Warning: Tip Over-Allocation</h3>
            <p>
              Rounding distributes <strong>${pendingResults.distributedTipsTotal.toFixed(2)}</strong>, exceeding total tips counted (<strong>${pendingResults.totalTips.toFixed(2)}</strong>) by <strong>${(pendingResults.distributedTipsTotal - pendingResults.totalTips).toFixed(2)}</strong>.
            </p>
            <div className="modal-actions">
              <button onClick={handleConfirmWarning} className="modal-proceed-btn">
                Proceed Anyway
              </button>
              <button onClick={() => setShowWarningModal(false)} className="modal-cancel-btn">
                Adjust Rounding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rounding;
