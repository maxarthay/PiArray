import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PiCard from './components/PiCard-node';

// Define the custom node type for the Map
const nodeTypes = {
  piCard: PiCard,
};

// Hardcoded initial data so we don't need Apollo or the backend to test the UI
const initialNodes = [
  {
    id: '1',
    type: 'piCard',
    position: { x: 250, y: 50 },
    data: { pi: { name: 'Raspberry Pi 1 (Test)' } },
  },
  {
    id: '2',
    type: 'piCard',
    position: { x: 250, y: 250 },
    data: { pi: { name: 'Raspberry Pi 2 (Test)' } },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
];

export default function TestMap() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // Boilerplate ReactFlow interaction handlers
  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#f9f9f9' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}
