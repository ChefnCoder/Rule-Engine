import React, { useState } from 'react';
import CreateRuleForm from './components/CreateRuleForm';
import RuleEvaluator from './components/RuleEvaluator';
import RuleList from './components/RuleList';
import CombineRules from './components/CombineRules';
import EditRule from './components/EditRule';
import './App.css';
const App = () => {
  const [ast, setAst] = useState(null); // Store AST here

  const handleAstGenerated = (newAst) => {
    setAst(newAst); // Set the AST when it’s created
  };

  return (
    <div className="container mx-auto p-6 space-y-8 bg-black">
      <h1 className="text-2xl font-semibold text-center mb-6 text-white">Rule Engine Application</h1>

      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* <h2 className="text-2xl font-semibold mb-4">Create a New Rule</h2> */}
        <CreateRuleForm onAstGenerated={handleAstGenerated} />
      </div>
      
      
        <div className="bg-white p-6 rounded-lg shadow-md">
          {/* <h2 className="text-2xl font-semibold mb-4">Evaluate Rule</h2> */}
          <RuleEvaluator ast={ast} />
        </div>
     

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* <h2 className="text-2xl font-semibold mb-4">Saved Rules</h2> */}
        <RuleList />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* <h2 className="text-2xl font-semibold mb-4">Combine Rules</h2> */}
        <CombineRules />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* <h2 className="text-2xl font-semibold mb-4">Edit Rule</h2> */}
        <EditRule />
      </div>
    </div>
  );
};

export default App;
