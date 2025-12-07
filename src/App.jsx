import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import ContractGeneratorV2 from './ContractGeneratorV2';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        {/* Navigation */}
        <nav className="navbar">
          <div className="container">
            <div className="nav-content">
              <Link to="/" className="logo-section">
                <img src="/logo.png" alt="DEVeats Logo" className="nav-logo" />
                <span className="nav-title">DEVeats</span>
              </Link>
              <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/generator">Create Token</Link>
                <a href="https://dexscreener.com/base/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">$DEVeats</a>
                <a href="https://basescan.org/token/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">Contract</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generator" element={<ContractGeneratorV2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
