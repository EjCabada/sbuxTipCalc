import React, { useState, useEffect } from 'react';
import './App.css';

const DENOMINATIONS = [
  { id: '0.01', label: 'Pennies ($0.01)', value: 0.01 },
  { id: '0.05', label: 'Nickels ($0.05)', value: 0.05 },
  { id: '0.10', label: 'Dimes ($0.10)', value: 0.10 },
  { id: '0.25', label: 'Quarters ($0.25)', value: 0.25 },
  { id: '1', label: '$1 Bills', value: 1 },
  { id: '2', label: '$2 Bills', value: 2 },
  { id: '5', label: '$5 Bills', value: 5 },
  { id: '10', label: '$10 Bills', value: 10 },
  { id: '20', label: '$20 Bills', value: 20 },
];

function TipCounter({ onConfirmTally, onBackToSummary, initialTotalTips = 0 }) {
  const [tallies, setTallies] = useState(() => {
    const saved = localStorage.getItem('tipTallies');
    return saved ? JSON.parse(saved) : {};
  });

  const [inputValues, setInputValues] = useState({});
  const [editingChunk, setEditingChunk] = useState(null);

  useEffect(() => {
    localStorage.setItem('tipTallies', JSON.stringify(tallies));
  }, [tallies]);

  const overallTotal = Object.entries(tallies).reduce((totalSum, [_, chunks]) => {
    if (!Array.isArray(chunks)) return totalSum;
    const denomSum = chunks.reduce((sum, chunk) => sum + (parseFloat(chunk.amount) || 0), 0);
    return totalSum + denomSum;
  }, 0);

  const handleInputChange = (denomId, val) => {
    setInputValues((prev) => ({ ...prev, [denomId]: val }));
  };

  const handleAddChunk = (denomId) => {
    const rawVal = inputValues[denomId];
    const val = parseFloat(rawVal);

    if (isNaN(val) || val <= 0) return;

    const newChunk = { id: Date.now().toString(), amount: val };

    setTallies((prev) => ({
      ...prev,
      [denomId]: [...(prev[denomId] || []), newChunk],
    }));

    setInputValues((prev) => ({ ...prev, [denomId]: '' }));
  };

  const handleDeleteChunk = (denomId, chunkId) => {
    setTallies((prev) => ({
      ...prev,
      [denomId]: (prev[denomId] || []).filter((c) => c.id !== chunkId),
    }));
  };

  const handleStartEditChunk = (denom, chunk) => {
    setEditingChunk({ denomId: denom.id, chunkId: chunk.id, val: String(chunk.amount) });
  };

  const handleSaveEditChunk = () => {
    if (!editingChunk) return;
    const val = parseFloat(editingChunk.val);

    if (isNaN(val) || val <= 0) {
      handleDeleteChunk(editingChunk.denomId, editingChunk.chunkId);
    } else {
      setTallies((prev) => ({
        ...prev,
        [editingChunk.denomId]: (prev[editingChunk.denomId] || []).map((c) =>
          c.id === editingChunk.chunkId ? { ...c, amount: val } : c
        ),
      }));
    }
    setEditingChunk(null);
  };

  const handleConfirm = () => {
    localStorage.setItem('totalTips', JSON.stringify(overallTotal));
    onConfirmTally(overallTotal);
  };

  return (
    <div className="tip-counter-container">
      <h2>Tip Money Tally Counter</h2>
      <p>Enter counted money in chunks by currency type.</p>

      {/* Sticky Live Total Bar */}
      <div className="sticky-total-bar">
        <span>Total Tips Counted:</span>
        <strong>${overallTotal.toFixed(2)}</strong>
      </div>

      <div className="denominations-grid">
        {DENOMINATIONS.map((denom) => {
          const denomChunks = tallies[denom.id] || [];
          const denomTotal = denomChunks.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);

          return (
            <div key={denom.id} className="denom-card">
              <div className="denom-header">
                <span className="denom-label">{denom.label}</span>
                <span className="denom-total">${denomTotal.toFixed(2)}</span>
              </div>

              {/* Chunks List */}
              {denomChunks.length > 0 && (
                <div className="chunk-list">
                  {denomChunks.map((chunk, idx) => (
                    <div key={chunk.id} className="chunk-item">
                      {editingChunk?.chunkId === chunk.id ? (
                        <div className="chunk-edit-box">
                          <input
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={editingChunk.val}
                            onChange={(e) =>
                              setEditingChunk({ ...editingChunk, val: e.target.value })
                            }
                            className="chunk-edit-input"
                          />
                          <button onClick={handleSaveEditChunk} className="chunk-save-btn">
                            Save
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="chunk-val">
                            Chunk {idx + 1}: <strong>${Number(chunk.amount).toFixed(2)}</strong>
                          </span>
                          <div className="chunk-actions">
                            <button
                              onClick={() => handleStartEditChunk(denom, chunk)}
                              className="chunk-btn edit"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteChunk(denom.id, chunk.id)}
                              className="chunk-btn delete"
                            >
                              ✕
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Add Chunk Input with iOS Numpad */}
              <div className="add-chunk-row">
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Chunk $ amount"
                  value={inputValues[denom.id] || ''}
                  onChange={(e) => handleInputChange(denom.id, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddChunk(denom.id)}
                  className="add-chunk-input"
                />
                <button onClick={() => handleAddChunk(denom.id)} className="add-chunk-btn">
                  + Add
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="tally-actions">
        <button onClick={onBackToSummary} style={{ backgroundColor: '#6c757d' }}>
          Back to Summary
        </button>
        <button onClick={handleConfirm} style={{ backgroundColor: 'var(--sbuxbrightgreen)' }}>
          Confirm Tally & Continue
        </button>
      </div>
    </div>
  );
}

export default TipCounter;
