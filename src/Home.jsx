import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>DEVeats Protocol</h1>
          <p className="tagline">LP Extraction Tax System That Pays Teams Without Dumping On Charts</p>
          <p className="subtitle">Where teams win without holders losing</p>

          <div className="links">
            <a href="https://dexscreener.com/base/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">Trade on DexScreener</a>
            <a href="https://basescan.org/token/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">View on BaseScan</a>
            <Link to="/generator" className="generator-link">Create Your Token</Link>
          </div>

          <div className="contract">
            <code>0xa4C4391bF643EbC391c9848453873656e1Fbd9d5</code>
          </div>
        </div>
      </section>

      {/* What is DEVeats */}
      <section className="section">
        <div className="container">
          <h2>What is DEVeats?</h2>
          <p>DEVeats is an Ethereum-based protocol that replaces traditional "sell-for-pay" team funding with an on-chain mechanism that extracts ETH from liquidity pools without selling tokens and simultaneously burns LP tokens to increase price stability.</p>
          <p style={{marginTop: '1rem'}}>Instead of devs dumping tokens → tanking the chart → angering holders…<br/>DEVeats lets teams get paid in ETH directly from the LP while reducing supply and strengthening the token price.</p>
        </div>
      </section>

      {/* How It Works */}
      <section className="section">
        <div className="container">
          <h2>How It Works</h2>

          <div className="how">
            <div>
              <h3>Buy Occurs</h3>
              <p>Protocol detects transaction</p>
            </div>
            <div>
              <h3>Tax Routed</h3>
              <p>% tax taken in ETH/WETH from LP</p>
            </div>
            <div>
              <h3>LP Burned</h3>
              <p>Supply decreases, price floor increases</p>
            </div>
            <div>
              <h3>Distribution</h3>
              <p>Teams get paid, zero sell pressure</p>
            </div>
          </div>

          <div style={{marginTop: '2rem'}}>
            <p>This lowers circulating supply, increases price floor, maintains market integrity, and prevents dev dumping. Fully transparent. No token sell pressure.</p>
          </div>
        </div>
      </section>

      {/* Contract Generator CTA */}
      <section className="section cta-section">
        <div className="container">
          <h2>Create Your Own DEVeats Token</h2>
          <p>Deploy a custom token with the DEVeats LP extraction system in minutes</p>
          <Link to="/generator" className="cta-button">Launch Contract Generator</Link>
          <p className="cta-subtext">Deployment fee: 0.0005 ETH</p>
        </div>
      </section>

      {/* Why Protocol */}
      <section className="section">
        <div className="container">
          <h2>Why This Is a Protocol</h2>
          <p>DEVeats is the first protocol that eliminates dev dumping by funding teams directly from LP mechanics while strengthening the token. This is a feature, not a rug.</p>
          <div style={{marginTop: '1.5rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto'}}>
            <p style={{fontSize: '1rem', marginBottom: '0.5rem'}}>✓ Reduces LP token supply</p>
            <p style={{fontSize: '1rem', marginBottom: '0.5rem'}}>✓ Increases pool's ETH ratio</p>
            <p style={{fontSize: '1rem', marginBottom: '0.5rem'}}>✓ Increases price per token</p>
            <p style={{fontSize: '1rem', marginBottom: '0.5rem'}}>✓ Pays teams transparently in ETH</p>
            <p style={{fontSize: '1rem'}}>✓ Standardizes safer tokenomics</p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <h2>Built By</h2>
          <div className="team">
            <div>
              <a href="https://twitter.com/nftaanon" target="_blank" rel="noopener noreferrer">@nftaanon</a>
              <span>Protocol Designer & Lead Developer</span>
            </div>
            <div>
              <a href="https://twitter.com/dudley420" target="_blank" rel="noopener noreferrer">@dudley420</a>
              <span>Smart Contract Architecture</span>
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
  );
}

export default Home;
