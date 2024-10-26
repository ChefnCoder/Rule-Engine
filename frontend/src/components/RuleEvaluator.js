import React, { useState } from 'react';
import { evaluateRule } from '../services/ruleService';

const RuleEvaluator = ({ ast }) => {
  const [data, setData] = useState({ age: '', department: '' });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleEvaluate = async () => {
    try {
      const evaluationResult = await evaluateRule(ast, data);
      setResult(evaluationResult.result);
    } catch (error) {
      console.error('Error evaluating rule:', error);
    }
  };

  return (
    <div>
      <h2>Evaluate Rule</h2>
      <input type="number" name="age" onChange={handleChange} placeholder="Age" />
      <input type="text" name="department" onChange={handleChange} placeholder="Department" />
      <button onClick={handleEvaluate}>Evaluate</button>
      {result !== null && <p>Evaluation Result: {result ? 'True' : 'False'}</p>}
    </div>
  );
};

export default RuleEvaluator;
