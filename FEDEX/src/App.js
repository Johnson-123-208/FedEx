import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TrackShipment from './pages/TrackShipment';
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import ManagerDashboard from './dashboards/ManagerDashboard';
import './index.css';

/**
 * Main App Component
 * Handles routing for the entire application
 */
function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/track" element={<TrackShipment />} />
                    <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
                    <Route path="/manager-dashboard" element={<ManagerDashboard />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
