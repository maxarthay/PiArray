import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PiCard from './components/PiCard-node';

// init. some Pis for testing frontend
const testPis = [
  { id: '1', name: 'Pi-001', model: 'Pi 4B', ipAddress: '192.168.1.10', isOnline: true, cpuUsage: 45, uptime: 3600, currScript: 'sensor.py' },
  { id: '2', name: 'Pi-002', model: 'Pi Zero', ipAddress: '192.168.1.11', isOnline: false, cpuUsage: 0, uptime: 0, currScript: '' },
]

// use testPis to create ReactFlow nodes
const initialNodes = [
  { id: testPis[0].id, type: 'piCard', position: { x: 0, y: 0 }, data: { pi: testPis[0] } },
  { id: testPis[1].id, type: 'piCard', position: { x: 0, y: 100 }, data: { pi: testPis[1] } },
];
// Node IDs are '1' and '2', so source/target must match!
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];
const nodeTypes = {
  piCard: PiCard
};
export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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
    <div style={{ width: '100vw', height: '100vh' }}>
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

// export default App
