import React, { useState } from 'react';
import CreateRuleForm from './components/CreateRuleForm';
import RuleEvaluator from './components/RuleEvaluator';
import RuleList from './components/RuleList';
import CombineRules from './components/CombineRules';
import EditRule from './components/EditRule';

const App = () => {
  const [ast, setAst] = useState(null); // Store AST here

  const handleAstGenerated = (newAst) => {
    setAst(newAst); // Set the AST when it’s created
  };

  return (
    <div>
      <h1>Rule Engine Application</h1>
      <CreateRuleForm onAstGenerated={handleAstGenerated} />
      {ast && <RuleEvaluator ast={ast} />} {/* Conditionally render the RuleEvaluator */}
      <RuleList />
      <CombineRules />
      <EditRule />
    </div>
  );
};

export default App;
