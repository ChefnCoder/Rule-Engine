import React, { useState, useEffect } from 'react';
import { getRules, combineRules } from '../services/ruleService';
import ASTNode from './ASTNode'; // Update path based on your folder structure

const CombineRules = () => {
  const [rules, setRules] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);
  const [operator, setOperator] = useState('&&');
  const [combinedResult, setCombinedResult] = useState(null);

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

  const handleRuleSelection = (ruleId) => {
    setSelectedRules((prevSelected) =>
      prevSelected.includes(ruleId)
        ? prevSelected.filter((id) => id !== ruleId)
        : [...prevSelected, ruleId]
    );
  };

  const handleCombine = async () => {
    if (selectedRules.length < 2) {
      alert('Please select at least two rules to combine.');
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
    <div className="p-4 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Combine Rules</h2>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Select Rules to Combine:</h3>
        <div className="space-y-2">
          {rules.map((rule) => (
            <label key={rule._id} className="block">
              <input
                type="checkbox"
                checked={selectedRules.includes(rule._id)}
                onChange={() => handleRuleSelection(rule._id)}
                className="mr-2"
              />
              {rule.rule}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-medium">Select Operator:</h3>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value="&&">AND</option>
          <option value="||">OR</option>
        </select>
      </div>
      <button
        onClick={handleCombine}
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        Combine Selected Rules
      </button>

      {combinedResult && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold">Combined Rule AST:</h4>
          <ASTNode node={combinedResult.ast} />
        </div>
      )}
    </div>
  );
};

export default CombineRules;
