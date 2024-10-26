import React, { useEffect, useState } from 'react';
import { getRules } from '../services/ruleService';

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
    <div>
      <h2>Saved Rules</h2>
      {rules.length > 0 ? (
        <ul>
          {rules.map((rule) => (
            <li key={rule._id}>
              <h4>Rule: {rule.rule}</h4>
              <pre>{JSON.stringify(rule.ast, null, 2)}</pre>
            </li>
          ))}
        </ul>
      ) : (
        <p>No rules found.</p>
      )}
    </div>
  );
};

export default RuleList;
