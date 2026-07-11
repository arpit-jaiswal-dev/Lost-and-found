import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import DashboardWithFloatingButton from './components/Dashboard';
import ReportForm from './components/ReportForm';
import ItemsList from './components/ItemsList';
import ItemDetail from './components/ItemDetail';
import HelpedStats from './components/HelpedStats';

function App() {
  const [user, setUser] = useState(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  useEffect(() => {
    const loggedInUser = localStorage.getItem('userInfo');
    if (loggedInUser) setUser(JSON.parse(loggedInUser));
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
  };
  return (
    <Router>
      <div className="min-h-screen anime-bg text-brand-text-primary flex flex-col">
        <header className="bg-brand-surface shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-3">
              <Link to={user ? "/dashboard" : "/"} className="text-xl md:text-2xl font-bold text-brand-primary hover:text-brand-primary-hover transition-colors">
                College Lost & Found
              </Link>
              {user && (
                <>
                  <nav className="hidden md:flex items-center space-x-4">
                    <Link to="/dashboard" className="link-style">Dashboard</Link>
                    <Link to="/report" className="link-style">Report Item</Link>
                    <Link to="/items" className="link-style">View Items</Link>
                    <button className="btn btn-danger text-sm py-1.5 px-3" onClick={handleLogout}>Logout</button>
                  </nav>
                  <div className="md:hidden">
                    <button onClick={() => setIsNavOpen(!isNavOpen)} className="text-brand-text-primary focus:outline-none">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {isNavOpen ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        )}
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </div>
            {user && isNavOpen && (
              <div className="md:hidden py-2 border-t border-brand-border">
                <nav className="flex flex-col space-y-2">
                  <Link to="/dashboard" className="link-style block px-2 py-1" onClick={() => setIsNavOpen(false)}>Dashboard</Link>
                  <Link to="/report" className="link-style block px-2 py-1" onClick={() => setIsNavOpen(false)}>Report Item</Link>
                  <Link to="/items" className="link-style block px-2 py-1" onClick={() => setIsNavOpen(false)}>View Items</Link>
                  <button className="btn btn-danger text-left w-full mt-2 py-1.5 px-2" onClick={() => { handleLogout(); setIsNavOpen(false); }}>Logout</button>
                </nav>
              </div>
            )}
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Routes>
            <Route 
              path="/" 
              element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} 
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/dashboard" /> : <Register setUser={setUser} />}
            />
            <Route 
              path="/dashboard" 
              element={user ? <DashboardWithFloatingButton /> : <Navigate to="/" />} 
            />
            <Route
              path="/helped"
              element={user ? <HelpedStats /> : <Navigate to="/" />}
            />
            <Route 
              path="/report" 
              element={user ? <ReportForm user={user} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/items" 
              element={user ? <ItemsList /> : <Navigate to="/" />} 
            />
            <Route 
              path="/items/:id" 
              element={user ? <ItemDetail /> : <Navigate to="/" />} 
            />
            {/* Redirect any unknown authenticated routes to dashboard */}
            {user && <Route path="*" element={<Navigate to="/dashboard" />} />}
          </Routes>
        </main>

        <footer className="bg-brand-surface text-brand-text-secondary py-4 text-center text-sm mt-auto">
          <p>&copy; {new Date().getFullYear()} College Lost & Found.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
