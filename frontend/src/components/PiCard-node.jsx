import { Handle, Position } from '@xyflow/react';
import './PiCard-node.css'

function PiCard({ data }) {
    const pi = data.pi;

    return (
        <div className="pi-card" style={{ padding: '10px', border: '1px solid black', borderRadius: '5px', background: 'white' }}>
            <Handle type="target" position={Position.Top} />
            <div>
                <label htmlFor="pi">{pi.name}</label>
            </div>
            <Handle type="source" position={Position.Bottom} />
        </div>
    )
}

export default PiCard
