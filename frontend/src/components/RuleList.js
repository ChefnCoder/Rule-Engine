import React, { useEffect, useState } from 'react';
import { getRules } from '../services/ruleService';
import ASTNode from './ASTNode';

const RuleList = () => {
  const [rules, setRules] = useState([]);

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

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gray-100 rounded-lg shadow-lg mt-8">
      <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">Saved Rules</h2>
      {rules.length > 0 ? (
        <ul className="space-y-6">
          {rules.map((rule) => (
            <li key={rule._id} className="bg-white p-6 rounded-lg shadow-md">
              <h4 className="text-xl font-semibold mb-4 text-purple-700">Rule: {rule.rule}</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <ASTNode node={rule.ast} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No rules found.</p>
      )}
    </div>
  );
};

export default RuleList;
