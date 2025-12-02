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
              <a href="https://dexscreener.com/base/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">$DEVeats</a>
              <a href="https://basescan.org/token/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">Contract</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>DEVeats Protocol</h1>
          <p className="tagline">LP Extraction Tax System That Pays Teams Without Dumping On Charts</p>
          <p className="subtitle">Where teams win without holders losing</p>

          <div className="links">
            <a href="https://dexscreener.com/base/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">Trade on DexScreener</a>
            <a href="https://basescan.org/token/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">View on BaseScan</a>
          </div>

          <div className="contract">
            <code>0xa4C4391bF643EbC391c9848453873656e1Fbd9d5</code>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="section">
        <div className="container">
          <h2>The Problem</h2>
          <p>Traditional token taxes force teams to dump on holders. Tax is collected in tokens, teams sell for funding, chart bleeds, holders panic. This is broken.</p>
        </div>
      </section>

      {/* The Solution */}
      <section className="section">
        <div className="container">
          <h2>The Solution</h2>
          <p>DEVeats extracts value directly from liquidity pools. No market sells. Teams get ETH, supply decreases, chart strengthens. Everyone wins.</p>

          <div className="how">
            <div>
              <h3>1. Collect Tax</h3>
              <p>Tokens accumulate in contract</p>
            </div>
            <div>
              <h3>2. Extract from LP</h3>
              <p>Burn LP, receive ETH + tokens</p>
            </div>
            <div>
              <h3>3. Distribute</h3>
              <p>ETH to teams, burn all tokens</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <h2>Built By</h2>
          <div className="team">
            <div>
              <strong>nftaanon</strong>
              <span>Protocol Designer & Lead Developer</span>
              <a href="https://twitter.com/nftaanon" target="_blank" rel="noopener noreferrer">@nftaanon</a>
            </div>
            <div>
              <strong>dudley420</strong>
              <span>Smart Contract Architecture</span>
              <a href="https://twitter.com/dudley420" target="_blank" rel="noopener noreferrer">@dudley420</a>
            </div>
          </div>

          <h3>Sponsors</h3>
          <div className="sponsors">
            <a href="https://twitter.com/Pxponies" target="_blank" rel="noopener noreferrer">@Pxponies</a>
            <a href="https://twitter.com/fomodrips" target="_blank" rel="noopener noreferrer">@fomodrips</a>
            <a href="https://twitter.com/nftmansa" target="_blank" rel="noopener noreferrer">@nftmansa</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <p>DEVeats Protocol v0.0.1 - Beta</p>
          <p>The revolution will not be dumped on.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
