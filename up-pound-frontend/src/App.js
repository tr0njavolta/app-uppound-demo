import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import PetList from './PetList';
import PetDetail from './PetDetail';
import AdoptionForm from './AdoptionForm';
import './styles.css';

function App() {
  const [showBanner, setShowBanner] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="app">
      {/* Demo Banner */}
      {showBanner && (
        <div className="demo-banner">
          <div className="demo-banner-content">
            <div className="demo-banner-icon">i</div>
            <span>Up-Pound: Pet Adoption Platform powered by Upbound Crossplane</span>
          </div>
          <button className="demo-close-button" onClick={() => setShowBanner(false)}>×</button>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="logo-area" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <div className="logo-box">UP</div>
            <div className="brand-info">
              <h1 className="app-name">
                Up-Pound
                <span className="demo-tag">Demo</span>
              </h1>
              <p className="app-tagline">Powered by Upbound</p>
            </div>
          </div>
          <nav className="nav-menu">
            <button 
              onClick={() => navigate('/')} 
              className="nav-item"
              style={{ 
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: window.location.pathname === '/' ? '600' : '400',
                color: window.location.pathname === '/' ? '#9a5efc' : '#030724',
                padding: '5px 0',
                position: 'relative'
              }}
            >
              Find Pets
              {window.location.pathname === '/' && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#9a5efc'
                }}></span>
              )}
            </button>
            <button 
              onClick={() => navigate('/about')}
              className="nav-item"
              style={{ 
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: window.location.pathname === '/about' ? '600' : '400',
                color: window.location.pathname === '/about' ? '#9a5efc' : '#030724',
                padding: '5px 0',
                position: 'relative'
              }}
            >
              About Demo
              {window.location.pathname === '/about' && (
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  height: '2px',
                  backgroundColor: '#9a5efc'
                }}></span>
              )}
            </button>
          </nav>
        </div>
      </header>

      <main className="main-container">
        <Routes>
          <Route path="/" element={
            <>
              <h1 className="page-title">Find Your Perfect Pet</h1>
              
              <div className="upbound-demo-banner">
                <div className="upbound-demo-icon">i</div>
                <span>Upbound Demo</span>
              </div>
              
              {/* Search Section */}
              <section className="search-section">
                <h2 className="search-heading">Search Pets</h2>
                <form className="search-form" onSubmit={(e) => e.preventDefault()}>
                  <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search for dogs, cats, and more..." 
                  />
                  <button type="submit" className="search-button">Search</button>
                </form>
                <div className="filter-pills">
                  <div className="filter-pill dogs">Dogs</div>
                  <div className="filter-pill cats">Cats</div>
                  <div className="filter-pill small">Small Pets</div>
                  <div className="filter-pill near">Near Me</div>
                </div>
              </section>
              
              {/* Upbound Info Section */}
              <section className="info-section">
                <h2 className="info-title">Powered by Upbound Crossplane</h2>
                <p className="info-text">
                  This demo showcases how pet adoption platforms can be deployed as microservices
                  on Kubernetes using Upbound Crossplane to manage cloud resources.
                </p>
                <button 
                  className="info-button"
                  onClick={() => navigate('/about')}
                >
                  View Architecture
                </button>
              </section>
              
              {/* Pet List Component */}
              <PetList />
            </>
          } />
          <Route path="/pets/:id" element={<PetDetail />} />
          <Route path="/adopt/:id" element={<AdoptionForm />} />
          <Route path="/about" element={
            <div>
              <h1 className="page-title">About This Demo</h1>
              <div className="search-section">
                <h2 className="search-heading">Upbound Crossplane Demo</h2>
                <p>
                  Up-Pound is a demonstration application showing how Upbound's Crossplane can be used
                  to deploy and manage cloud resources for a microservices architecture.
                </p>
                <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Architecture</h3>
                <p>This application consists of:</p>
                <ul style={{ marginLeft: '20px', lineHeight: '1.6' }}>
                  <li><strong>Frontend:</strong> React single-page application</li>
                  <li><strong>Backend API:</strong> Node.js with Express</li>
                  <li><strong>Database:</strong> PostgreSQL (managed by Crossplane as AWS RDS)</li>
                  <li><strong>Storage:</strong> File storage for pet images (managed by Crossplane as AWS S3)</li>
                </ul>
                <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Crossplane Resources</h3>
                <div style={{ 
                  backgroundColor: '#f4f6f9', 
                  padding: '15px', 
                  borderRadius: '8px', 
                  fontFamily: 'monospace' 
                }}>
                  <div>XPostgreSQLInstance (RDS)</div>
                  <div>XS3Bucket (Object Storage)</div>
                  <div>XVPCNetwork (Networking)</div>
                </div>
                <div style={{ marginTop: '20px' }}>
                  <button 
                    onClick={() => navigate('/')}
                    style={{ 
                      display: 'inline-flex',
                      alignItems: 'center',
                      color: '#9a5efc',
                      textDecoration: 'none',
                      fontWeight: '500',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    ← Back to Home
                  </button>
                </div>
              </div>
            </div>
          } />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-logo-area">
              <div className="footer-logo">UP</div>
              <span>Powered by Upbound Crossplane</span>
            </div>
            <div className="footer-links">
              <a href="https://github.com/yourusername/up-pound" className="footer-link" target="_blank" rel="noopener noreferrer">View Demo Source</a>
              <a href="https://www.upbound.io/docs" className="footer-link" target="_blank" rel="noopener noreferrer">Upbound Documentation</a>
            </div>
          </div>
          <div className="footer-bottom">
            This is a demo application. No real pets or shelters are represented.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
