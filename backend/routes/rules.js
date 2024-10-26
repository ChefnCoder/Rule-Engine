const express = require('express');
const router = express.Router();
const Rule = require('../models/Rule');
const createAST = require('../utils/astParser');

// Create Rule Endpoint
router.post('/create', async (req, res) => {
  const { rule } = req.body;
  try {
    const ast = createAST(rule);
    const newRule = new Rule({ rule, ast });
    await newRule.save();
    res.status(201).json(newRule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Evaluate Rule Endpoint
router.post('/evaluate', async (req, res) => {
  const { ast, data } = req.body;

  const evaluateNode = (node, data) => {
    if (node.type === 'BinaryExpression' && node.operator !== '&&' && node.operator !== '||') {
      const { left, operator, right } = node;
  
      if (!left || !right) {
        return false;
      }
  
      const leftValue = data[left.name];
      const rightValue = right.value;
  
      switch (operator) {
        case '>': return leftValue > rightValue;
        case '<': return leftValue < rightValue;
        case '===': return leftValue === rightValue;
        case '>=': return leftValue >= rightValue;
        case '<=': return leftValue <= rightValue;
        default: return false;
      }
    } 
    else if (node.type === 'LogicalExpression' || node.operator === '&&' || node.operator === '||') {
      const { left, operator, right } = node;
  
      const leftResult = evaluateNode(left, data);
      const rightResult = evaluateNode(right, data);
  
      if (operator === '&&') return leftResult && rightResult;
      if (operator === '||') return leftResult || rightResult;
    }
    return false;
  };
  
  try {
    const result = evaluateNode(ast, data);
    res.status(200).json({ result });
  } catch (error) {
    res.status(400).json({ error: 'Evaluation failed' });
  }
});

// Fetch all rules
router.get('/list', async (req, res) => {
  try {
    const rules = await Rule.find();
    res.status(200).json(rules);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rules' });
  }
});

// Combine Rules Endpoint
router.post('/combine', async (req, res) => {
  const { ruleIds, operator } = req.body;

  // Check if operator is valid
  if (operator !== '&&' && operator !== '||') {
    return res.status(400).json({ error: 'Invalid operator. Use && or ||.' });
  }

  try {
    // Fetch each rule by its ID from the database
    const rules = await Rule.find({ _id: { $in: ruleIds } });
    if (rules.length !== ruleIds.length) {
      return res.status(404).json({ error: 'One or more rules not found.' });
    }

    // Extract ASTs from each rule
    const asts = rules.map(rule => rule.ast);

    // Combine ASTs under a new root node with the specified operator
    const combinedAST = asts.reduce((accumulator, currentAST) => {
      return {
        type: 'LogicalExpression',
        operator: operator,
        left: accumulator,
        right: currentAST
      };
    });

    // Save the combined rule to the database
    const combinedRule = new Rule({
      rule: `Combined rule with ${operator}`,
      ast: combinedAST
    });
    await combinedRule.save();

    res.status(201).json(combinedRule);
  } catch (error) {
    console.error('Error combining rules:', error);
    res.status(500).json({ error: 'Failed to combine rules' });
  }
});

module.exports = router;
