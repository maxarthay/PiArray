import { COffcanvas, COffcanvasHeader, COffcanvasBody, CCloseButton, CBadge } from '@coreui/react';
import './DetailSidebar.css'

export default function DetailSidebar({ pi, visible, onClose }) {
    const isOnline = pi?.isOnline;

    return (
        <COffcanvas
            className="right-sidebar"
            visible={visible}
            onHide={onClose}
            placement="end"
            backdrop={false}
            style={{ zIndex: 1000 }}>
            <COffcanvasHeader className='header-container'>
                <h3>Details</h3>
                <CCloseButton onClick={onClose} />
            </COffcanvasHeader>
            <COffcanvasBody className="offcanvas-content" style={{ padding: 0 }}>
                <div style={{ padding: '1.5rem' }}>
                    <h3 className="offcanvas-name">{pi?.name || 'Device'}</h3>
                    <div>
                        <CBadge color={isOnline ? "success" : "danger"} className="detail-badge mb-4">
                            {isOnline ? 'Online' : 'Offline'}
                        </CBadge>
                    </div>

                    <div className="detail-row">
                        <strong>ID:</strong> <span>{pi?.id || ''}</span>
                    </div>
                    <div className="detail-row">
                        <strong>IP Address:</strong> <span>{pi?.ipAddress || 'Unknown'}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Current Script:</strong>
                        <span className="code-block">{pi?.currScript || 'None'}</span>
                    </div>
                    <div className="detail-row">
                        <strong>CPU Usage:</strong>
                        <span>{pi?.cpuUsage !== null && pi?.cpuUsage !== undefined ? `${pi.cpuUsage}%` : 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Uptime:</strong>
                        <span>{pi?.uptime || '0 hrs'}</span>
                    </div>
                </div>
            </COffcanvasBody>
        </COffcanvas>
    )
}