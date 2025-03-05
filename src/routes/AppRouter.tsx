import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import { AuthProvider } from '../context/AuthContext';

const AppRouter: React.FC = () => {
    return (

        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/home/*" element={<Home />} />        
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AppRouter;