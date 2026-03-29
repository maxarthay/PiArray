import { CSidebar, CSidebarNav, CNavItem, CSidebarBrand, CSidebarHeader } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilHome, cilList, cilSettings, cilMap } from '@coreui/icons';
import '@coreui/coreui/dist/css/coreui.min.css';
import './Sidebar.css';

export default function Sidebar() {
    return (
        <CSidebar
            className="custom-sidebar"
            colorScheme="light"
            visible={true}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                transform: 'none',
                marginLeft: 0,
                zIndex: 1000
            }}>
            <CSidebarHeader className='header-container'>
                <CSidebarBrand className='header-brand' href="#">PiArray</CSidebarBrand>
            </CSidebarHeader>
            <CSidebarNav>
                <CNavItem href="#">
                    <CIcon customClassName="nav-icon" icon={cilHome} />
                    Home
                </CNavItem>
                <CNavItem href="/dashboard">
                    <CIcon customClassName="nav-icon" icon={cilList} />
                    Dashboard
                </CNavItem>
                <CNavItem href="/map">
                    <CIcon customClassName="nav-icon" icon={cilMap} />
                    Map
                </CNavItem>
            </CSidebarNav>
        </CSidebar>
    )
}