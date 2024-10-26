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

  if (operator !== '&&' && operator !== '||') {
    return res.status(400).json({ error: 'Invalid operator. Use && or ||.' });
  }

  try {
    const rules = await Rule.find({ _id: { $in: ruleIds } });
    if (rules.length !== ruleIds.length) {
      return res.status(404).json({ error: 'One or more rules not found.' });
    }

    const asts = rules.map(rule => rule.ast);
    const combinedAST = asts.reduce((accumulator, currentAST) => {
      return {
        type: 'LogicalExpression',
        operator: operator,
        left: accumulator,
        right: currentAST
      };
    });

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

// Helper function to generate a rule string from the AST
const generateRuleStringFromAST = (node) => {
  if (node.type === 'BinaryExpression') {
    const left = generateRuleStringFromAST(node.left);
    const right = generateRuleStringFromAST(node.right);
    return `${left} ${node.operator} ${right}`;
  } else if (node.type === 'Identifier') {
    return node.name;
  } else if (node.type === 'Literal') {
    // Check if this literal value is a string that represents a number
    const numericValue = parseFloat(node.value);
    // If it's a numeric value (e.g., "40" becomes 40), return it as a number
    if (!isNaN(numericValue) && node.value === numericValue.toString()) {
      return numericValue;
    }
    // Otherwise, return it as a string wrapped in quotes
    return `'${node.value}'`;
  }
  return '';
};



/// Modify Rule Endpoint using findByIdAndUpdate
// Modify Rule Endpoint using findByIdAndUpdate
router.put('/modify/:id', async (req, res) => {
  const ruleId = req.params.id;
  const { modifications } = req.body;

  try {
    // Fetch the rule by ID to get the current AST structure
    const rule = await Rule.findById(ruleId);
    if (!rule) {
      return res.status(404).json({ error: 'Rule not found' });
    }

    // Apply modifications to the AST
    const applyModifications = (node, path) => {
      if (modifications[path]) {
        const nodeModifications = modifications[path];
        if (nodeModifications.operator !== undefined) node.operator = nodeModifications.operator;
        if (nodeModifications.value !== undefined) {
          node.value = nodeModifications.value;
          node.raw = typeof node.value === "string" ? `'${node.value}'` : `${node.value}`;
        }
      }

      // Traverse to child nodes using updated paths
      if (node.left) applyModifications(node.left, `${path}.left`);
      if (node.right) applyModifications(node.right, `${path}.right`);
    };

    // Start applying modifications from the root node
    applyModifications(rule.ast, 'root');

    // Generate the new rule string from the updated AST
    const updatedRuleString = generateRuleStringFromAST(rule.ast);

    // Use findByIdAndUpdate to update both the AST and the rule string
    const updatedRule = await Rule.findByIdAndUpdate(
      ruleId,
      { ast: rule.ast, rule: updatedRuleString },
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedRule);
  } catch (error) {
    console.error('Error modifying rule:', error);
    res.status(500).json({ error: 'Failed to modify rule' });
  }
});

module.exports = router;
