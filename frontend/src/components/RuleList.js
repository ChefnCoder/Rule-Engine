import React, { useEffect, useState } from 'react';
import { getRules } from '../services/ruleService';
import ASTNode from './ASTNode';

const RuleList = () => {
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const ruleList = await getRules();
        const rulesWithToggle = ruleList.map(rule => ({ ...rule, isVisible: false }));
        setRules(rulesWithToggle);
      } catch (error) {
        console.error('Error fetching rules:', error);
      }
    };
    fetchRules();
  }, []);

  const toggleRuleVisibility = (id) => {
    setRules(prevRules =>
      prevRules.map(rule =>
        rule._id === id ? { ...rule, isVisible: !rule.isVisible } : rule
      )
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-semibold text-center mb-6 text-blue-700">Saved Rules</h2>
      {rules.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {rules.map((rule) => (
            <div key={rule._id} className="bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm text-purple-700">Rule: {rule.rule}</h4>
                <button
                  onClick={() => toggleRuleVisibility(rule._id)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  {rule.isVisible ? "Hide Details" : "Show Details"}
                </button>
              </div>
              {rule.isVisible && (
                <div className="bg-gray-50 p-3 mt-2 rounded-md text-xs">
                  <ASTNode node={rule.ast} />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-sm">No rules found.</p>
      )}
    </div>
  );
};

export default RuleList;
