import { useState } from 'react';
import './Services.css';

function Services() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'contract',
    projectDescription: '',
    budget: '',
    timeline: ''
  });

  const [formStatus, setFormStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: '', message: '' });

    // Simulate form submission (replace with actual backend endpoint)
    try {
      // For now, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In production, you would send this to your backend
      console.log('Form submitted:', formData);

      setFormStatus({
        type: 'success',
        message: 'Thank you for your inquiry! We will get back to you within 24 hours.'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        service: 'contract',
        projectDescription: '',
        budget: '',
        timeline: ''
      });
    } catch (error) {
      setFormStatus({
        type: 'error',
        message: 'Something went wrong. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="services-page">
      {/* Hero Section */}
      <section className="services-hero">
        <div className="container">
          <h1>Professional Blockchain Development Services</h1>
          <p className="services-tagline">
            Full-service smart contract and dApp development for your Web3 project
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section services-overview">
        <div className="container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🔗</div>
              <h3>Smart Contract Development</h3>
              <ul className="service-features">
                <li>Custom ERC-20, ERC-721, and ERC-1155 tokens</li>
                <li>DeFi protocols (staking, lending, DEX)</li>
                <li>NFT minting and marketplace contracts</li>
                <li>DAO governance systems</li>
                <li>Advanced tokenomics implementation</li>
                <li>Gas optimization and security audits</li>
                <li>Multi-chain deployment (Ethereum, Base, Polygon, etc.)</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon">💻</div>
              <h3>Full-Stack dApp Development</h3>
              <ul className="service-features">
                <li>Modern React/Next.js frontend development</li>
                <li>Web3 wallet integration (MetaMask, WalletConnect)</li>
                <li>Smart contract interaction and state management</li>
                <li>Real-time blockchain data indexing</li>
                <li>Responsive UI/UX design</li>
                <li>Backend API development and database integration</li>
                <li>IPFS integration for decentralized storage</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-choose">
        <div className="container">
          <h2>Why Choose DEVeats Development?</h2>
          <div className="benefits-grid">
            <div className="benefit">
              <h4>🛡️ Security First</h4>
              <p>Rigorous testing and security best practices in every contract we write</p>
            </div>
            <div className="benefit">
              <h4>⚡ Battle-Tested</h4>
              <p>Our DEVeats protocol is live and working on Base with real value locked</p>
            </div>
            <div className="benefit">
              <h4>🎯 Transparent Process</h4>
              <p>Regular updates, clear communication, and milestone-based delivery</p>
            </div>
            <div className="benefit">
              <h4>💡 Innovation Focused</h4>
              <p>We build cutting-edge solutions that push the boundaries of DeFi</p>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section process-section">
        <div className="container">
          <h2>Our Development Process</h2>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <h4>Discovery & Planning</h4>
              <p>We analyze your requirements and design the optimal solution</p>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <h4>Development</h4>
              <p>Agile development with regular check-ins and demos</p>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <h4>Testing & Audit</h4>
              <p>Comprehensive testing and optional third-party security audit</p>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <h4>Deployment & Support</h4>
              <p>Mainnet deployment and ongoing maintenance support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section contact-section">
        <div className="container">
          <h2>Start Your Project</h2>
          <p className="contact-intro">
            Tell us about your project and we'll get back to you within 24 hours with a detailed proposal.
          </p>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="service">Service Type *</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="contract">Smart Contract Development</option>
                <option value="dapp">Full-Stack dApp Development</option>
                <option value="both">Both Contract & dApp</option>
                <option value="audit">Security Audit</option>
                <option value="consultation">Consultation</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="projectDescription">Project Description *</label>
              <textarea
                id="projectDescription"
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Describe your project, key features, and any specific requirements..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="budget">Estimated Budget</label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                >
                  <option value="">Select range</option>
                  <option value="under-5k">Under $5,000</option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k-plus">$50,000+</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="timeline">Desired Timeline</label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                >
                  <option value="">Select timeline</option>
                  <option value="urgent">ASAP (1-2 weeks)</option>
                  <option value="fast">Fast (2-4 weeks)</option>
                  <option value="normal">Normal (1-2 months)</option>
                  <option value="flexible">Flexible (2+ months)</option>
                </select>
              </div>
            </div>

            {formStatus.message && (
              <div className={`form-status ${formStatus.type}`}>
                {formStatus.message}
              </div>
            )}

            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>

          <div className="contact-info">
            <p>Prefer to reach out directly?</p>
            <div className="direct-contact">
              <a href="https://twitter.com/nftaanon" target="_blank" rel="noopener noreferrer">
                @nftaanon on Twitter
              </a>
              <span>•</span>
              <a href="https://twitter.com/dudley420" target="_blank" rel="noopener noreferrer">
                @dudley420 on Twitter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio CTA */}
      <section className="section portfolio-cta">
        <div className="container">
          <h3>See Our Work</h3>
          <p>Check out the DEVeats Protocol - a live example of our smart contract expertise</p>
          <div className="portfolio-links">
            <a href="https://dexscreener.com/base/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">
              View on DexScreener
            </a>
            <a href="https://basescan.org/token/0xa4C4391bF643EbC391c9848453873656e1Fbd9d5" target="_blank" rel="noopener noreferrer">
              View Contract
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
