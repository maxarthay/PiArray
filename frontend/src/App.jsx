import MapPage from "./pages/Map-page";
import DashboardPage from "./pages/Dashboard-page";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";

export default function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const page = location.pathname.split("/")[1];

    return (
        <div style={{ display: "flex" }}>
            <Sidebar activeNav={page} onNavChange={(label) => navigate(`/${label.toLowerCase()}`)} />
            <Routes>
                <Route path="/map" element={<MapPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
        </div>
    )
}


// pages for:
// - map
// - dashboard
// - settings
// - scripts
// - groups
// - main
// - login
// - register