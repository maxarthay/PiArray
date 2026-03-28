import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
    CCard, 
    CCardBody, 
    COffcanvas, 
    COffcanvasHeader, 
    COffcanvasTitle, 
    COffcanvasBody, 
    CBadge,
    CCloseButton 
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilCode } from '@coreui/icons';
import './PiCard-node.css'

function PiCard({ data }) {
    const pi = data.pi;
    const [visible, setVisible] = useState(false);

    // Compute status colors
    const isOnline = pi.isOnline;
    const statusColor = isOnline ? '#10b981' : '#ef4444'; // Emerald green vs Red
    const statusShadow = isOnline ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.4)';

    return (
        <>
            <div className="pi-node-wrapper" onClick={() => setVisible(true)}>
                <Handle type="target" position={Position.Top} className="handle-top" />
                
                <CCard className="pi-card border-0">
                    <CCardBody className="pi-card-body">
                        <div className="pi-header">
                            <h5 className="pi-name">{pi.name}</h5>
                            <div 
                                className="pi-status-dot" 
                                style={{ 
                                    backgroundColor: statusColor,
                                    boxShadow: `0 0 8px ${statusShadow}`
                                }}
                                title={isOnline ? 'Online' : 'Offline'}
                            />
                        </div>
                        
                        <div className="pi-id-badge">
                            <CBadge color="secondary" shape="rounded-pill">ID: {pi.id}</CBadge>
                        </div>

                        <div className="pi-script">
                            <CIcon icon={cilCode} className="pi-icon" />
                            <span className="script-text">{pi.currScript || 'No active script'}</span>
                        </div>
                    </CCardBody>
                </CCard>

                <Handle type="source" position={Position.Bottom} className="handle-bottom" />
            </div>

            <COffcanvas placement="end" visible={visible} onHide={() => setVisible(false)} className="pi-offcanvas">
                <COffcanvasHeader>
                    <COffcanvasTitle>Device Details</COffcanvasTitle>
                    <CCloseButton className="text-reset btn-close-white" onClick={() => setVisible(false)} />
                </COffcanvasHeader>
                <COffcanvasBody>
                    <div className="offcanvas-content">
                        <h3 className="offcanvas-name">{pi.name}</h3>
                        <CBadge color={isOnline ? "success" : "danger"} className="mb-4">
                            {isOnline ? 'Online' : 'Offline'}
                        </CBadge>

                        <div className="detail-row">
                            <strong>ID:</strong> <span>{pi.id}</span>
                        </div>
                        <div className="detail-row">
                            <strong>IP Address:</strong> <span>{pi.ipAddress || 'Unknown'}</span>
                        </div>
                        <div className="detail-row">
                            <strong>Current Script:</strong> 
                            <span className="code-block">{pi.currScript || 'None'}</span>
                        </div>
                        <div className="detail-row">
                            <strong>CPU Usage:</strong> 
                            <span>{pi.cpuUsage !== null ? `${pi.cpuUsage}%` : 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                            <strong>Uptime:</strong> 
                            <span>{pi.uptime || '0 hrs'}</span>
                        </div>
                    </div>
                </COffcanvasBody>
            </COffcanvas>
        </>
    )
}

export default PiCard
