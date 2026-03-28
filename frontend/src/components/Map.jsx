import { useState, useCallback, useMemo, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PiCard from './PiCard-node';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client/core';
import './Map.css'

const GET_FLEET = gql`
  query GetFleet {
    fleet {
      id
      name
      model
      ipAddress
      isOnline
      cpuUsage
      uptime
      currScript
    }
  }
`;

// nodeTypes must be defined outside the component to avoid re-renders
const nodeTypes = {
  piCard: PiCard,
};

export default function Map() {
  const { loading, error, data } = useQuery(GET_FLEET);

  // Build initial nodes from fetched data
  const initialNodes = useMemo(() => {
    if (!data?.fleet) return [];
    return data.fleet.map((pi, index) => ({
      id: pi.id,
      type: 'piCard',
      position: { x: 0, y: index * 120 },
      data: { pi },
    }));
  }, [data]);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // When data arrives, update the nodes state
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
  }, [initialNodes]);

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

  if (loading) return <p>Loading fleet...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div style={{ width: 'calc(100vw - 64px)', height: '100vh', marginLeft: '64px', backgroundColor: '#020617' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        className='map'
        colorMode="dark"
      >
        <Background bgColor="#F2F2F2 " variant={BackgroundVariant.Dots} gap={32} size={1} color="#000000" />
      </ReactFlow>
    </div>
  );
}