import React from 'react';

const ASTNode = ({ node }) => {
  if (!node) return null;

  return (
    <div className="ml-4 border-l pl-4 my-2">
      <div className="font-semibold text-blue-600">{node.type}</div>
      {node.operator && (
        <div className="text-gray-700">
          <strong>Operator:</strong> <span className="font-mono">{node.operator}</span>
        </div>
      )}
      {node.name && (
        <div className="text-gray-700">
          <strong>Attribute:</strong> <span className="font-mono">{node.name}</span>
        </div>
      )}
      {node.value !== undefined && (
        <div className="text-gray-700">
          <strong>Value:</strong> <span className="font-mono">{node.value}</span>
        </div>
      )}
      <div className="mt-2">
        {node.left && <ASTNode node={node.left} />}
        {node.right && <ASTNode node={node.right} />}
      </div>
    </div>
  );
};

export default ASTNode;
