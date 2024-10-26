import React, { useState } from 'react';
import { evaluateRule } from '../services/ruleService';

const RuleEvaluator = ({ ast }) => {
  const [data, setData] = useState({
    age: '',
    department: '',
    income: '',
    spend: '',
    customCondition: "" // Default template
  });
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleEvaluate = async () => {
    // Filter out parameters that have empty values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => value !== '')
    );

    console.log('Evaluating with data:', filteredData);
    console.log('AST:', ast);

    try {
      const evaluationResult = await evaluateRule(ast, filteredData);
      setResult(evaluationResult.result);
    } catch (error) {
      console.error('Error evaluating rule:', error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white shadow-xl rounded-lg p-6 max-w-lg mx-auto mt-8 transform transition-all hover:scale-105 hover:shadow-2xl">
      <h2 className="text-xl font-semibold mb-4 text-center text-indigo-600">Evaluate Rule</h2>
      <h6 className="text-sm font-semibold mb-4 text-center text-indigo-600">Only Works after Creating or Combining Data</h6>
      <div className="space-y-4">
        <input
          type="number"
          name="age"
          value={data.age}
          onChange={handleChange}
          placeholder="Enter Age"
          className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />
        <input
          type="text"
          name="department"
          value={data.department}
          onChange={handleChange}
          placeholder="Enter Department"
          className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />
        <input
          type="number"
          name="income"
          value={data.income}
          onChange={handleChange}
          placeholder="Enter Income"
          className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />
        <input
          type="number"
          name="spend"
          value={data.spend}
          onChange={handleChange}
          placeholder="Enter Spend"
          className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
        />
        <button
          onClick={handleEvaluate}
          className="w-full py-2 bg-indigo-500 text-white rounded-lg font-semibold text-sm shadow-lg hover:bg-indigo-600 transition-all transform hover:scale-105 hover:shadow-xl"
        >
          Evaluate
        </button>
      </div>
      {result !== null && (
        <div
          className={`mt-4 p-4 rounded-lg transition-all duration-500 ${
            result ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <h4 className="font-semibold text-sm text-center text-gray-700">Evaluation Result:</h4>
          <p
            className={`text-xl font-bold text-center ${
              result ? 'text-green-600' : 'text-red-600'
            } animate-pulse`}
          >
            {result ? 'True' : 'False'}
          </p>
        </div>
      )}
    </div>
  );
};

export default RuleEvaluator;
