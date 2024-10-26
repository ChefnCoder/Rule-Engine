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
      onAstGenerated(result.ast); // Pass the generated AST to App.js
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  return (
    <div>
      <h2>Create a New Rule</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={rule}
          onChange={(e) => setRule(e.target.value)}
          placeholder="Enter rule, e.g., age > 30 && department === 'Sales'"
        />
        <button type="submit">Create Rule</button>
      </form>
      {response && (
        <div>
          <h4>AST Generated:</h4>
          <pre>{JSON.stringify(response.ast, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CreateRuleForm;
