import { CCard, CCardBody, CBadge } from '@coreui/react';
import './PiCard-dashboard.css';

export default function PiCardDashboard({ pi }) {
    return (
        <CCard className='pi-card-dashboard'>
            <CCardBody>
                <h5 className="card-title">{pi.name}</h5>
                <p className="card-text">{pi.model}</p>
                <p className="card-text">{pi.ipAddress}</p>
                <CBadge color={pi.isOnline ? "success" : "danger"}>
                    {pi.isOnline ? 'Online' : 'Offline'}
                </CBadge>
            </CCardBody>
        </CCard>
    );
}