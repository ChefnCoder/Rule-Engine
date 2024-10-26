import React, { useState, useEffect } from 'react';
import { getRules, modifyRule } from '../services/ruleService';

const EditRule = () => {
  const [rules, setRules] = useState([]);
  const [selectedRule, setSelectedRule] = useState(null);
  const [modifications, setModifications] = useState({});

  // Fetch rules on component mount
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

  // Handle rule selection
  const handleRuleSelection = (ruleId) => {
    const rule = rules.find((r) => r._id === ruleId);
    setSelectedRule(rule);
    setModifications({});
  };

  // Recursive function to display modifiable nodes only
  const renderModifiableNodes = (node, nodePath = '') => {
    if (!node) return null;

    const pathKey = nodePath || 'root'; // Use 'root' for the top-level node

    return (
      <div key={pathKey}>
        <h4>Node Path: {pathKey}</h4>
        {node.operator !== undefined && (
          <div>
            <label>Operator:</label>
            <input
              type="text"
              placeholder={node.operator}
              value={modifications[pathKey]?.operator || ''}
              onChange={(e) =>
                handleModificationChange(pathKey, 'operator', e.target.value)
              }
            />
          </div>
        )}
        {node.value !== undefined && (
          <div>
            <label>Value:</label>
            <input
              type="text"
              placeholder={node.value}
              value={modifications[pathKey]?.value || ''}
              onChange={(e) =>
                handleModificationChange(pathKey, 'value', e.target.value)
              }
            />
          </div>
        )}
        {node.left && renderModifiableNodes(node.left, `${pathKey}.left`)}
        {node.right && renderModifiableNodes(node.right, `${pathKey}.right`)}
      </div>
    );
  };

  // Handle modification inputs
  const handleModificationChange = (nodePath, field, value) => {
    setModifications((prevMods) => ({
      ...prevMods,
      [nodePath]: {
        ...prevMods[nodePath],
        [field]: value,
      },
    }));
  };

  // Submit modifications
  const handleSave = async () => {
    try {
      await modifyRule(selectedRule._id, modifications);
      alert('Rule modified successfully!');
      setSelectedRule(null);
    } catch (error) {
      console.error('Error modifying rule:', error);
    }
  };

  return (
    <div>
      <h2>Edit Rule</h2>
      <div>
        <h3>Select a Rule to Edit:</h3>
        {rules.map((rule) => (
          <button key={rule._id} onClick={() => handleRuleSelection(rule._id)}>
            {rule.rule}
          </button>
        ))}
      </div>

      {selectedRule && (
        <div>
          <h3>Modify AST Nodes</h3>
          {renderModifiableNodes(selectedRule.ast)}
          <button onClick={handleSave}>Save Modifications</button>
        </div>
      )}
    </div>
  );
};

export default EditRule;
