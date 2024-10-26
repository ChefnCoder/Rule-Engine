import React, { useState } from 'react';
import { createRule } from '../services/ruleService';

const CreateRuleForm = ({ onAstGenerated }) => {
  const [rule, setRule] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createRule(rule);
      setResponse(result);
      setRule('');
      onAstGenerated(result.ast);
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">Create a New Rule</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          placeholder="Enter rule, e.g., age > 30 && department === 'Sales'"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Create Rule
        </button>
      </form>
      {response && (
        <div className="mt-4 p-2 bg-gray-100 rounded">
          <h4 className="font-semibold">AST Generated:</h4>
          <pre className="text-sm">{JSON.stringify(response.ast, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CreateRuleForm;
