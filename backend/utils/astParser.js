const jsep = require('jsep');

const createAST = (ruleString) => {
  try {
    const expressionTree = jsep(ruleString);
    return expressionTree;
  } catch (error) {
    throw new Error('Invalid rule format');
  }
};

module.exports = createAST;
