import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="surface-card p-6 md:p-8 max-w-4xl mx-auto mt-8 md:mt-12">
      <h2 className="page-title text-center mb-8">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <Link to="/report" className="dashboard-card block group">
          <div className="surface-card p-6 rounded-lg h-full flex flex-col items-center justify-center text-center border-2 border-transparent group-hover:border-brand-primary transition-colors duration-300">
            <div className="text-5xl mb-4" role="img" aria-label="Report Item Icon">📝</div>
            <h3 className="section-title mb-2 text-brand-text-primary">Report Lost/Found Item</h3>
            <p className="text-brand-text-secondary">Submit a new lost or found item report.</p>
          </div>
        </Link>
        <Link to="/items" className="dashboard-card block group">
          <div className="surface-card p-6 rounded-lg h-full flex flex-col items-center justify-center text-center border-2 border-transparent group-hover:border-brand-primary transition-colors duration-300">
            <div className="text-5xl mb-4" role="img" aria-label="View Items Icon">👁️</div>
            <h3 className="section-title mb-2 text-brand-text-primary">View Reported Items</h3>
            <p className="text-brand-text-secondary">Browse all lost and found items.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

// Floating Helped Stats Button - outside dashboard box, bottom right of page
const FloatingHelpedStatsButton = () => (
  <Link
    to="/helped"
    className="fixed bottom-8 right-8 z-50"
    style={{ textDecoration: 'none' }}
    aria-label="View Till Now Helped Stats"
  >
    <div className="bg-brand-primary hover:bg-brand-primary-hover text-brand-button-text shadow-lg rounded-full p-4 flex items-center justify-center transition-colors duration-300 text-3xl border-4 border-brand-surface animate-pulse-slow" style={{ boxShadow: '0 8px 24px 0 rgba(245,185,66,0.25)' }}>
      <span role="img" aria-label="Helped Stats">🤝</span>
    </div>
  </Link>
);

const DashboardWithFloatingButton = () => (
  <>
    <Dashboard />
    <FloatingHelpedStatsButton />
  </>
);

export default DashboardWithFloatingButton;
