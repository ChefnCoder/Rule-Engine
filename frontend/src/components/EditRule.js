import React, { useState, useEffect } from 'react';
import { getRules, modifyRule } from '../services/ruleService';

const EditRule = () => {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [modifications, setModifications] = useState({});

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
    const rule = rules.find((r) => r._id === ruleId);
    setSelectedRule(rule);
    setModifications({});
  };

  const renderModifiableNodes = (node, pathKey = 'root') => {  // Start pathKey with 'root'
    if (!node) return null;

    return (
      <div className="mb-2 p-2 bg-gray-50 rounded-md shadow-sm">
        {node.operator !== undefined && (
          <div className="mb-1">
            <label className="block text-gray-600 text-sm">Operator:</label>
            <input
              type="text"
              placeholder={
                typeof node.operator === 'object'
                  ? JSON.stringify(node.operator, null, 2)
                  : node.operator
              }
              value={modifications[pathKey]?.operator || ''}
              onChange={(e) =>
                handleModificationChange(pathKey, 'operator', e.target.value)
              }
              className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
        )}
        {node.value !== undefined && (
          <div className="mb-1">
            <label className="block text-gray-600 text-sm">Value:</label>
            <input
              type="text"
              placeholder={
                typeof node.value === 'object'
                  ? JSON.stringify(node.value, null, 2)
                  : node.value
              }
              value={modifications[pathKey]?.value || ''}
              onChange={(e) =>
                handleModificationChange(pathKey, 'value', e.target.value)
              }
              className="w-full px-3 py-2 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
            />
          </div>
        )}
        {node.left && renderModifiableNodes(node.left, `${pathKey}.left`)}
        {node.right && renderModifiableNodes(node.right, `${pathKey}.right`)}
      </div>
    );
  };

  const handleModificationChange = (nodePath, field, value) => {
    setModifications((prevMods) => ({
      ...prevMods,
      [nodePath]: {
        ...prevMods[nodePath],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      await modifyRule(selectedRule._id, modifications);
      alert('Rule modified successfully!');
      setSelectedRule(null);
      
      // Reload the page after a 5-second delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error modifying rule:', error);
    }
  };
  
  

  return (
    <div className="bg-gray-100 shadow-lg rounded-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-600">Edit Rule</h2>
      
      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2 text-gray-800">Select a Rule to Edit:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {rules.map((rule) => (
            <button
              key={rule._id}
              onClick={() => handleRuleSelection(rule._id)}
              className="py-2 px-3 bg-indigo-100 text-indigo-700 rounded-md shadow-sm hover:bg-indigo-200 text-sm text-center"
            >
              {rule.rule}
            </button>
          ))}
        </div>
      </div>

      {selectedRule && (
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h3 className="text-xl font-medium text-indigo-600 mb-3">Modify AST Nodes</h3>
          {renderModifiableNodes(selectedRule.ast)}
          <button
            onClick={handleSave}
            className="w-full py-2 bg-blue-500 text-white rounded-lg font-semibold shadow-md hover:bg-blue-600 mt-3"
          >
            Save Modifications
          </button>
        </div>
      )}
    </div>
  );
};

export default EditRule;
