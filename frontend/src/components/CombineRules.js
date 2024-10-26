import React, { useState, useEffect } from 'react';
import { getRules, combineRules } from '../services/ruleService';
import ASTNode from './ASTNode';

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
      alert("Rules combined successfully!");
    } catch (error) {
      console.error('Error combining rules:', error);
    }
  };

  return (
    <div className="bg-gray-100 shadow-lg rounded-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Combine Rules</h2>

      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2 text-gray-800">Select Rules to Combine:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {rules.map((rule) => (
            <label key={rule._id} className="flex items-center bg-indigo-100 p-2 rounded-md shadow-sm hover:bg-indigo-200 transition text-sm">
              <input
                type="checkbox"
                checked={selectedRules.includes(rule._id)}
                onChange={() => handleRuleSelection(rule._id)}
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-0"
              />
              <span className="text-gray-700">{rule.rule}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2 text-gray-800">Select Operator:</h3>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        >
          <option value="&&">AND</option>
          <option value="||">OR</option>
        </select>
      </div>

      <button
        onClick={handleCombine}
        className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 transition mt-3"
      >
        Combine Selected Rules
      </button>

      {combinedResult && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
          <h4 className="text-xl font-medium mb-3 text-indigo-600">Combined Rule AST:</h4>
          <ASTNode node={combinedResult.ast} />
        </div>
      )}
    </div>
  );
};

export default CombineRules;
