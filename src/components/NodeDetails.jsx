import React from 'react';

export default function NodeDetails({ selectedNode }) {
  console.log('NodeDetails render, selectedNode =', selectedNode);

  if (!selectedNode) {
    return (
      <p className="text-sm text-gray-500">
        Click a node to see its properties.
      </p>
    );
  }

  return (
    <div className="space-y-2 text-sm">
      <p><strong>Label:</strong> {selectedNode.label}</p>
      <p><strong>Description:</strong> {selectedNode.description}</p>
      <p><strong>Code:</strong> {selectedNode.code}</p>
      <p><strong>Grades:</strong> {selectedNode.grade_levels?.join(', ')}</p>
      <p>
        <strong>URI:</strong>{' '}
        <a
          href={selectedNode.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {selectedNode.uri}
        </a>
      </p>
    
      <p><strong>Created:</strong> {selectedNode.created}</p>
    </div>
  );
}
