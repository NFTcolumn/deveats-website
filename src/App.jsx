import './App.css'

function App() {
  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="nav-content">
            <div className="logo-section">
              <img src="/logo.png" alt="DEVeats Logo" className="nav-logo" />
              <span className="nav-title">DEVeats</span>
            </div>
            <div className="nav-links">
              <a href="https://dexscreener.com/base/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">DexScreener</a>
              <a href="https://basescan.org/token/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">BaseScan</a>
              <a href="#about">About</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#team">Team</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <img src="/logo.png" alt="DEVeats Logo" className="hero-logo" />
            <h1 className="hero-title">DEVeats Protocol</h1>
            <p className="hero-subtitle">LP Extraction Tax System That Pays Teams Without Dumping On Charts</p>
            <p className="hero-tagline">Where teams win without holders losing</p>
            <div className="hero-buttons">
              <a href="https://dexscreener.com/base/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Trade on DexScreener</a>
              <a href="https://basescan.org/token/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">View Contract</a>
            </div>
            <div className="contract-address">
              <span className="label">Contract:</span>
              <code>0xa4C4391bF643EbC391c9848453873656e1Fbd9d5</code>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section about-section">
        <div className="container">
          <h2 className="section-title">The Revolution in Token Economics</h2>
          <p className="section-intro">
            DEVeats introduces a revolutionary approach to token taxation that solves the fundamental problem plaguing crypto projects:
            <strong> how to sustainably fund development without destroying token value through sell pressure.</strong>
          </p>
          <div className="version-badge">Version: v0.0.1 - Beta Release</div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section problem-section">
        <div className="container">
          <h2 className="section-title">The Problem</h2>
          <div className="problem-card">
            <h3>Traditional Token Tax Models Are Broken</h3>
            <p>Every successful token project needs funding, but traditional tax systems create a death spiral:</p>
            <ol className="problem-list">
              <li>Tax is collected in tokens</li>
              <li>Tokens must be swapped for ETH</li>
              <li>This creates sell pressure on the chart</li>
              <li>Price drops, holders panic</li>
              <li>Team needs more tokens to maintain funding</li>
              <li>More selling, more downward pressure</li>
            </ol>
            <p className="highlight">This model is fundamentally adversarial - the team's success comes at the direct expense of holders.</p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="how-it-works" className="section solution-section">
        <div className="container">
          <h2 className="section-title">The Solution: LP Extraction</h2>
          <p className="section-intro">DEVeats completely reimagines token taxation through a three-phase process:</p>

          <div className="phases">
            <div className="phase-card">
              <div className="phase-number">1</div>
              <h3>Token Tax Collection</h3>
              <ul>
                <li>Buy/Sell transactions are taxed in tokens (default 5%)</li>
                <li>Tokens accumulate in the contract</li>
                <li>No immediate sell pressure - just token collection</li>
                <li>Threshold-based trigger (default: 0.1% of supply)</li>
              </ul>
            </div>

            <div className="phase-card">
              <div className="phase-number">2</div>
              <h3>LP Extraction (The Innovation)</h3>
              <ul>
                <li>Anyone can call <code>extractTax()</code> when threshold is met</li>
                <li>Calculate LP to burn proportionally</li>
                <li>Burn LP tokens from the pool</li>
                <li>Receive ETH + tokens from LP</li>
                <li>Burn all tokens permanently</li>
              </ul>
            </div>

            <div className="phase-card">
              <div className="phase-number">3</div>
              <h3>Value Distribution</h3>
              <ul>
                <li>0.1% license fee to protocol creators</li>
                <li>99.9% distributed to project wallets:</li>
                <ul className="sub-list">
                  <li>Development wallet</li>
                  <li>Marketing wallet</li>
                  <li>Buyback wallet</li>
                  <li>Charity wallet</li>
                </ul>
              </ul>
            </div>
          </div>

          <div className="magic-card">
            <h3>The Magic: Three Benefits From One Action</h3>
            <div className="benefits-grid">
              <div className="benefit">
                <div className="benefit-icon">💰</div>
                <h4>Teams Get Funded in ETH</h4>
                <p>No sell pressure, stable funding</p>
              </div>
              <div className="benefit">
                <div className="benefit-icon">🔥</div>
                <h4>Supply Decreases</h4>
                <p>Both tax tokens and extracted tokens are burned</p>
              </div>
              <div className="benefit">
                <div className="benefit-icon">📈</div>
                <h4>Chart Strengthens</h4>
                <p>Less circulating supply + same liquidity = higher price floor</p>
              </div>
            </div>
            <p className="magic-tagline">This is the first tax system where teams win AND holders win.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <h2 className="section-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🔓 Permissionless</h3>
              <p>Anyone can trigger extraction when threshold is met - no centralized control</p>
            </div>
            <div className="feature-card">
              <h3>🔍 Transparent</h3>
              <p>All operations on-chain, fully auditable, predictable outcomes</p>
            </div>
            <div className="feature-card">
              <h3>♻️ Sustainable</h3>
              <p>0.1% license fee funds continuous protocol development</p>
            </div>
            <div className="feature-card">
              <h3>🎯 Simple</h3>
              <p>Elegant three-step process - collect, extract, distribute</p>
            </div>
            <div className="feature-card">
              <h3>🔒 Secure</h3>
              <p>Reentrancy protection, access controls, fail-safe error handling</p>
            </div>
            <div className="feature-card">
              <h3>⚡ Efficient</h3>
              <p>Separation of concerns prevents gas issues and failed transactions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="section comparison-section">
        <div className="container">
          <h2 className="section-title">DEVeats vs Traditional Tax Systems</h2>
          <div className="comparison-table">
            <div className="comparison-row header">
              <div className="comparison-cell">Feature</div>
              <div className="comparison-cell">DEVeats</div>
              <div className="comparison-cell">Traditional</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell">Sell Pressure</div>
              <div className="comparison-cell positive">None ✓</div>
              <div className="comparison-cell negative">Constant ✗</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell">Supply Reduction</div>
              <div className="comparison-cell positive">Yes ✓</div>
              <div className="comparison-cell negative">No ✗</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell">Gas Efficiency</div>
              <div className="comparison-cell positive">High ✓</div>
              <div className="comparison-cell negative">Low ✗</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-cell">Team-Holder Alignment</div>
              <div className="comparison-cell positive">Aligned ✓</div>
              <div className="comparison-cell negative">Adversarial ✗</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="section team-section">
        <div className="container">
          <h2 className="section-title">Authors</h2>
          <div className="team-grid">
            <div className="team-card">
              <h3>nftaanon</h3>
              <p className="team-role">Protocol Designer & Lead Developer</p>
              <a href="https://twitter.com/nftaanon" target="_blank" rel="noopener noreferrer" className="team-link">@nftaanon</a>
            </div>
            <div className="team-card">
              <h3>dudley420</h3>
              <p className="team-role">Smart Contract Architecture</p>
              <a href="https://twitter.com/dudley420" target="_blank" rel="noopener noreferrer" className="team-link">@dudley420</a>
            </div>
          </div>

          <h2 className="section-title sponsors-title">Sponsors</h2>
          <div className="sponsors-grid">
            <div className="sponsor-card">
              <a href="https://twitter.com/Pxponies" target="_blank" rel="noopener noreferrer" className="sponsor-link">@Pxponies</a>
            </div>
            <div className="sponsor-card">
              <a href="https://twitter.com/fomodrips" target="_blank" rel="noopener noreferrer" className="sponsor-link">@fomodrips</a>
            </div>
            <div className="sponsor-card">
              <a href="https://twitter.com/nftmansa" target="_blank" rel="noopener noreferrer" className="sponsor-link">@nftmansa</a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <h2 className="section-title">Join the Movement</h2>
          <p className="cta-text">This is not just about one protocol or one team. This is about elevating the entire industry.</p>
          <div className="cta-buttons">
            <a href="https://dexscreener.com/base/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer" className="btn btn-primary">Trade DEVeats</a>
            <a href="https://basescan.org/token/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">View on BaseScan</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <img src="/logo.png" alt="DEVeats Logo" className="footer-logo" />
              <p className="footer-tagline">Where teams win without holders losing</p>
            </div>
            <div className="footer-section">
              <h4>Protocol</h4>
              <p>Version: v0.0.1 - Beta</p>
              <p>License: MIT</p>
              <p>Status: Live on Base</p>
            </div>
            <div className="footer-section">
              <h4>Contract</h4>
              <p className="contract-info">
                <a href="https://basescan.org/token/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">
                  0xa4C4391bF643EbC391c9848453873656e1Fbd9d5
                </a>
              </p>
            </div>
            <div className="footer-section">
              <h4>Links</h4>
              <div className="footer-links">
                <a href="https://dexscreener.com/base/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">DexScreener</a>
                <a href="https://basescan.org/token/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">BaseScan</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 DEVeats Protocol. Built with ❤️ by nftaanon & dudley420</p>
            <p className="footer-motto">The revolution will not be dumped on.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
