import React, { useState } from 'react';
import { createRule } from '../services/ruleService';

const CreateRuleForm = ({ onAstGenerated }) => {
  const [rule, setRule] = useState('');
  const [response, setResponse] = useState(null);

  const [age, setAge] = useState('');
  const [ageOperator, setAgeOperator] = useState('>');
  const [department, setDepartment] = useState('');
  const [departmentOperator, setDepartmentOperator] = useState('===');
  const [income, setIncome] = useState('');
  const [incomeOperator, setIncomeOperator] = useState('>');
  const [spend, setSpend] = useState('');
  const [spendOperator, setSpendOperator] = useState('<');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createRule(rule);
      setResponse(result);
      setRule('');
      onAstGenerated(result.ast);
      alert("AST created successfully!");
    } catch (error) {
      console.error('Error creating rule:', error);
    }
  };

  const handlePredefinedSubmit = async (e) => {
    e.preventDefault();
    const conditions = [];

    if (age) conditions.push(`age ${ageOperator} ${age}`);
    if (department) conditions.push(`department ${departmentOperator} '${department}'`);
    if (income) conditions.push(`income ${incomeOperator} ${income}`);
    if (spend) conditions.push(`spend ${spendOperator} ${spend}`);

    const generatedRule = conditions.join(' && ');
    setRule(generatedRule);

    if (generatedRule) {
      try {
        const result = await createRule(generatedRule);
        setResponse(result);
        setAge('');
        setAgeOperator('>');
        setDepartment('');
        setDepartmentOperator('===');
        setIncome('');
        setIncomeOperator('>');
        setSpend('');
        setSpendOperator('<');
        onAstGenerated(result.ast);
        alert("AST created successfully!");
      } catch (error) {
        console.error('Error creating rule:', error);
      }
    } else {
      console.error('No valid conditions provided for rule creation');
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-white shadow-xl rounded-lg p-6 max-w-lg mx-auto transform transition-all hover:scale-105 hover:shadow-2xl">
      <h2 className="text-xl font-semibold mb-4 text-center text-indigo-600">Create a New Rule</h2>
      
      <div className="mb-6">
        <h3 className="font-semibold text-md mb-2">Enter Custom Rule</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={rule}
            onChange={(e) => setRule(e.target.value)}
            placeholder="Enter rule, e.g., age > 30 && department === 'Sales'"
            className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
          />
          <button
            type="submit"
            className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 text-sm font-semibold transition-all"
          >
            Create Rule
          </button>
        </form>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold text-md mb-2">Or, Use Predefined Fields</h3>
        <form onSubmit={handlePredefinedSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            {/* Age Field */}
            <div>
              <label className="block text-gray-700 text-sm">Age</label>
              <div className="flex items-center space-x-2">
                <select
                  value={ageOperator}
                  onChange={(e) => setAgeOperator(e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm"
                >
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value="===">==</option>
                </select>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>
            </div>
            
            {/* Department Field */}
            <div>
              <label className="block text-gray-700 text-sm">Department</label>
              <div className="flex items-center space-x-2">
                <select
                  value={departmentOperator}
                  onChange={(e) => setDepartmentOperator(e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm"
                >
                  <option value="===">==</option>
                  <option value="!==">!=</option>
                </select>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>
            </div>

            {/* Income Field */}
            <div>
              <label className="block text-gray-700 text-sm">Income</label>
              <div className="flex items-center space-x-2">
                <select
                  value={incomeOperator}
                  onChange={(e) => setIncomeOperator(e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm"
                >
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value="===">==</option>
                </select>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>
            </div>

            {/* Spend Field */}
            <div>
              <label className="block text-gray-700 text-sm">Spend</label>
              <div className="flex items-center space-x-2">
                <select
                  value={spendOperator}
                  onChange={(e) => setSpendOperator(e.target.value)}
                  className="border rounded-lg px-2 py-1 text-sm"
                >
                  <option value=">">&gt;</option>
                  <option value="<">&lt;</option>
                  <option value="===">==</option>
                </select>
                <input
                  type="number"
                  value={spend}
                  onChange={(e) => setSpend(e.target.value)}
                  className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-lg font-semibold shadow-lg hover:bg-green-600 transition-all transform hover:scale-105 hover:shadow-xl text-sm mt-3"
          >
            Generate and Create Rule
          </button>
        </form>
      </div>

      {response && (
        <div className="mt-4 p-4 rounded-lg bg-gray-100 transition-all duration-500 text-sm">
          <h4 className="font-semibold text-center">AST Generated:</h4>
          <pre className="text-center">{JSON.stringify(response.ast, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CreateRuleForm;
