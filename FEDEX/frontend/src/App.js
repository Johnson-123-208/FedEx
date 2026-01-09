import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import Home from './pages/Home';
import Login from './pages/Login';
import TrackShipment from './pages/TrackShipment';
import ServiceProviders from './pages/ServiceProviders';

// Employee Pages
import EmployeeDashboard from './dashboards/EmployeeDashboard';
import MyShipments from './pages/employee/MyShipments';
import Profile from './pages/employee/Profile';
import BulkUpload from './pages/employee/BulkUpload';

// Manager Pages
import ManagerDashboard from './dashboards/ManagerDashboard';
import AllShipments from './pages/manager/AllShipments';
import AgentPerformance from './pages/manager/AgentPerformance';

import Layout from './components/layout/Layout';
import './index.css';

/**
 * AnimatedRoutes Component
 */
const AnimatedRoutes = () => {
    const location = useLocation();

    // Check if we are in a dashboard route to disable standard layout transition if needed
    // or just kep it simple

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                {/* Public Routes - Wrapped in Public Layout */}
                <Route path="/" element={<Layout><Home /></Layout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/track" element={<Layout><TrackShipment /></Layout>} />
                <Route path="/providers" element={<Layout><ServiceProviders /></Layout>} />

                {/* Protected Employee Routes */}
                <Route
                    path="/employee-dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout role="employee">
                                <EmployeeDashboard />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee/shipments"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout role="employee">
                                <MyShipments />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee/profile"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout role="employee">
                                <Profile />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/employee/bulk-upload"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout role="employee">
                                <BulkUpload />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Protected Manager Routes */}
                <Route
                    path="/manager-dashboard"
                    element={
                        <ProtectedRoute requiredRole="manager">
                            <DashboardLayout role="manager">
                                <ManagerDashboard />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager/shipments"
                    element={
                        <ProtectedRoute requiredRole="manager">
                            <DashboardLayout role="manager">
                                <AllShipments />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/manager/performance"
                    element={
                        <ProtectedRoute requiredRole="manager">
                            <DashboardLayout role="manager">
                                <AgentPerformance />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </AnimatePresence>
    );
};

/**
 * Main App Component
 */
function App() {
    return (
        <AuthProvider>
            <Router>
                {/* We moved Layout inside Routes so we can exclude it for Dashboard pages if we want, 
                    or wrap specific pages. BUT DashboardLayout includes its own structure. 
                    So we only use standard Layout for public pages. */}
                <AnimatedRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;
