import { Handle, Position } from '@xyflow/react';
import { 
    CCard, 
    CCardBody, 
    CBadge
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilCode } from '@coreui/icons';
import './PiCard-node.css'

function PiCard({ data }) {
    const pi = data.pi;

    // Compute status colors for light mode
    const isOnline = pi.isOnline;
    const statusColor = isOnline ? '#10b981' : '#f43f5e'; // Emerald green vs Rose

    return (
        <div className="pi-node-wrapper">
            <Handle type="target" position={Position.Top} className="handle-top" />
            
            <CCard className="pi-card border-0">
                <CCardBody className="pi-card-body">
                    <div className="pi-header">
                        <h5 className="pi-name">{pi.name}</h5>
                        <div 
                            className="pi-status-dot" 
                            style={{ backgroundColor: statusColor }}
                            title={isOnline ? 'Online' : 'Offline'}
                        />
                    </div>
                    
                    <div className="pi-id-badge">
                        <CBadge color="light" textColor="dark" shape="rounded">ID: {pi.id}</CBadge>
                    </div>

                    <div className="pi-script">
                        <CIcon icon={cilCode} className="pi-icon" />
                        <span className="script-text">{pi.currScript || 'No active script'}</span>
                    </div>
                </CCardBody>
            </CCard>

            <Handle type="source" position={Position.Bottom} className="handle-bottom" />
        </div>
    )
}

export default PiCard
