/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/preserve-manual-memoization */
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, BackgroundVariant, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import PiCard from './PiCard-node';
import DetailSidebar from './DetailSidebar';
import { useQuery, useMutation } from '@apollo/client/react';
import './Map.css'
import { GET_FLEET, GET_GROUPS, UPDATE_PI_POSITION } from './queries';

// nodeTypes must be defined outside the component to avoid re-renders
const nodeTypes = {
  piCard: PiCard,
};

export default function Map() {
  const { loading, error, data } = useQuery(GET_FLEET);
  const { data: groupsData } = useQuery(GET_GROUPS);
  const [updatePiPosition] = useMutation(UPDATE_PI_POSITION);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedPi, setSelectedPi] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('All');


  const saveTimers = useRef({});

  const groups = groupsData?.groups || [];

  // Only show groups that are actually present on at least one Pi
  const activeGroups = useMemo(() => {
    if (!data?.fleet) return [];
    const activeNames = new Set(data.fleet.map(pi => pi.groupName).filter(Boolean));
    return groups.filter(g => activeNames.has(g.name));
  }, [groups, data?.fleet]);

  // Build initial nodes from fetched data, using saved positions
  const initialNodes = useMemo(() => {
    if (!data?.fleet) return [];
    return data.fleet.map((pi, index) => ({
      id: pi.id,
      type: 'piCard',
      position: {
        x: pi.positionX ?? index * 260,
        y: pi.positionY ?? 0,
      },
      data: { pi },
    }));
  }, [data]);

  // When data arrives, update the nodes state
  useEffect(() => {
    if (initialNodes.length > 0) {
      setNodes(initialNodes);
    }
  }, [initialNodes]);

  // Filter nodes by group
  const filteredNodes = useMemo(() => {
    if (selectedGroup === 'All') return nodes;
    return nodes.filter(node => node.data.pi.groupName === selectedGroup);
  }, [nodes, selectedGroup]);

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

  const onNodeClick = useCallback((event, node) => {
    setSelectedPi(node.data.pi);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedPi(null);
  }, []);

  // Save position to DB on drag stop (debounced per node)
  const onNodeDragStop = useCallback((event, node) => {
    const nodeId = node.id;
    const { x, y } = node.position;

    // Clear any existing timer for this node
    if (saveTimers.current[nodeId]) {
      clearTimeout(saveTimers.current[nodeId]);
    }

    // Debounce: wait 500ms after last drag stop before saving
    saveTimers.current[nodeId] = setTimeout(() => {
      updatePiPosition({
        variables: {
          id: nodeId,
          positionX: x,
          positionY: y,
        },
      }).catch(err => console.error('Failed to save position:', err));
      delete saveTimers.current[nodeId];
    }, 500);
  }, [updatePiPosition]);

  if (loading) return <p>Loading fleet...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <div style={{ width: 'calc(100vw - 256px)', height: '100vh', position: 'relative', backgroundColor: '#f8fafc' }}>
        {/* Group filter dropdown */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 8,
            padding: '6px 10px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}>
            <FilterIcon size={13} color="#6b7280" />
            <select
              value={selectedGroup}
              onChange={e => setSelectedGroup(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: 13,
                color: '#111',
                cursor: 'pointer',
                fontFamily: 'system-ui, sans-serif',
              }}
            >
              <option value="All">All groups</option>
              {activeGroups.map(g => (
                <option key={g.id} value={g.name}>{g.name}</option>
              ))}
            </select>
          </div>
          {selectedGroup !== 'All' && (
            <button
              onClick={() => setSelectedGroup('All')}
              style={{
                background: '#f3f4f6',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: '6px 10px',
                fontSize: 12,
                color: '#6b7280',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>

        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onNodeDragStop={onNodeDragStop}
          fitView
          className='map'
          colorMode="light"
        >
          <Background bgColor="#f8fafc" variant={BackgroundVariant.Dots} gap={32} size={1} color="#cbd5e1" />
          <Controls />
        </ReactFlow>
      </div>
      <DetailSidebar pi={selectedPi} visible={!!selectedPi} onClose={() => setSelectedPi(null)} />
      <p className="group-instruction">Drag nodes to arrange • positions auto-save</p>
    </>
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────
function FilterIcon({ size = 16, color = "currentColor" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}