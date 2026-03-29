import MapPage from "./pages/Map-page";
import DashboardPage from "./pages/Dashboard-page";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/map" element={<MapPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
        </Router>
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