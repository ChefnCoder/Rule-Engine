import React, { useState, useEffect } from 'react';
import { getRules, combineRules } from '../services/ruleService';

const CombineRules = () => {
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [operator, setOperator] = useState('&&');
  const [combinedResult, setCombinedResult] = useState(null);

  // Fetch rules on component mount
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const ruleList = await getRules();
        setRules(ruleList);
      } catch (error) {
        console.error('Error fetching rules:', error);
      }
    };
    fetchRules();
  }, []);

  // Handle rule selection
  const handleRuleSelection = (ruleId) => {
    setSelectedRules((prevSelected) => {
      if (prevSelected.includes(ruleId)) {
        return prevSelected.filter(id => id !== ruleId);
      } else {
        return [...prevSelected, ruleId];
      }
    });
  };

  // Handle Combine action
  const handleCombine = async () => {
    if (selectedRules.length < 2) {
      alert("Please select at least two rules to combine.");
      return;
    }
    try {
      const result = await combineRules(selectedRules, operator);
      setCombinedResult(result);
    } catch (error) {
      console.error('Error combining rules:', error);
    }
  };

  return (
    <div>
      <h2>Combine Rules</h2>
      <div>
        <h3>Select Rules to Combine:</h3>
        {rules.map((rule) => (
          <div key={rule._id}>
            <input
              type="checkbox"
              checked={selectedRules.includes(rule._id)}
              onChange={() => handleRuleSelection(rule._id)}
            />
            <label>{rule.rule}</label>
          </div>
        ))}
      </div>

      <div>
        <h3>Select Operator:</h3>
        <select value={operator} onChange={(e) => setOperator(e.target.value)}>
          <option value="&&">AND</option>
          <option value="||">OR</option>
        </select>
      </div>

      <button onClick={handleCombine}>Combine Selected Rules</button>

      {combinedResult && (
        <div>
          <h4>Combined Rule AST:</h4>
          <pre>{JSON.stringify(combinedResult.ast, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CombineRules;
