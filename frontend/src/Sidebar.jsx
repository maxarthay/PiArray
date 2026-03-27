import { CSidebar, CSidebarNav, CNavItem } from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';

export default function Sidebar() {
    return (
        <CSidebar>
            <CSidebarNav>
                <CNavItem href="#">Home</CNavItem>
            </CSidebarNav>
        </CSidebar>
    )
}