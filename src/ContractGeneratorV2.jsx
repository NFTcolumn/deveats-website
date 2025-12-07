import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './ContractGenerator.css';

const DEVEATS_TOKEN = '0xa4C4391bF643EbC391c9848453873656e1Fbd9d5'; // Base mainnet
const DEVEATS_ABI = [
  "function balanceOf(address account) external view returns (uint256)"
];

const FACTORY_ABI = [
  "function deployToken(string memory _name, string memory _symbol, uint256 _initialSupply, address _routerAddress, address _devWallet, address _marketingWallet, address _buybackWallet, address _charityWallet) external payable returns (address)",
  "function DEPLOYMENT_FEE() external view returns (uint256)"
];

const NETWORKS = {
  'localhost': {
    name: 'Localhost (Hardhat)',
    chainId: 31337,
    rpcUrl: 'http://127.0.0.1:8545',
    routerAddress: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    factoryAddress: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    explorer: '',
    requiresToken: false // Skip token check for localhost
  },
  'base': {
    name: 'Base Mainnet',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    routerAddress: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
    factoryAddress: '',
    explorer: 'https://basescan.org',
    requiresToken: true
  },
  'base-sepolia': {
    name: 'Base Sepolia',
    chainId: 84532,
    rpcUrl: 'https://sepolia.base.org',
    routerAddress: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
    factoryAddress: '',
    explorer: 'https://sepolia.basescan.org',
    requiresToken: false // Skip token check for testnet
  }
};

const DEPLOYMENT_FEE = '0.0005';

function ContractGeneratorV2() {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    initialSupply: '',
    buyTax: '5',
    sellTax: '5'
  });

  const [features, setFeatures] = useState({
    burn: true, // Default to enabled (original behavior)
    maxWallet: false,
    maxTx: false
  });

  const [featureSettings, setFeatureSettings] = useState({
    maxWalletPercent: '2',
    maxTxPercent: '1'
  });

  const [wallets, setWallets] = useState([
    { name: 'Dev', address: '', share: '25' }
  ]);

  const [network, setNetwork] = useState('localhost');
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('');
  const [deployedAddress, setDeployedAddress] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(1);

  const checkTokenBalance = async (address) => {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS['base'].rpcUrl);
      const tokenContract = new ethers.Contract(DEVEATS_TOKEN, DEVEATS_ABI, provider);
      const balance = await tokenContract.balanceOf(address);
      return balance > 0n;
    } catch (error) {
      console.error('Error checking token balance:', error);
      return false;
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this feature');
      return;
    }

    setIsCheckingAccess(true);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      setAccount(address);
      setIsConnected(true);

      // Check if network requires token
      if (NETWORKS[network].requiresToken) {
        const hasToken = await checkTokenBalance(address);
        if (!hasToken) {
          setHasAccess(false);
          setIsConnected(false);
          setAccount(null);
          alert('Access Denied: You must hold DEVeats tokens to use this generator.\n\nBuy $DEVeats on Uniswap: https://app.uniswap.org/swap?outputCurrency=' + DEVEATS_TOKEN + '&chain=base');
          return;
        }
      }

      setHasAccess(true);
      await switchNetwork();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet: ' + error.message);
    } finally {
      setIsCheckingAccess(false);
    }
  };

  const switchNetwork = async () => {
    const targetNetwork = NETWORKS[network];
    const chainIdHex = '0x' + targetNetwork.chainId.toString(16);

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: targetNetwork.name,
              rpcUrls: [targetNetwork.rpcUrl],
              blockExplorerUrls: targetNetwork.explorer ? [targetNetwork.explorer] : []
            }]
          });
        } catch (addError) {
          console.error('Error adding network:', addError);
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  };

  const handleFeatureSettingChange = (setting, value) => {
    setFeatureSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const addWallet = () => {
    setWallets([...wallets, { name: '', address: '', share: '0' }]);
  };

  const removeWallet = (index) => {
    if (wallets.length > 1) {
      setWallets(wallets.filter((_, i) => i !== index));
    }
  };

  const updateWallet = (index, field, value) => {
    const updated = [...wallets];
    updated[index][field] = value;
    setWallets(updated);
  };

  const getTotalShare = () => {
    return wallets.reduce((sum, w) => sum + (parseInt(w.share) || 0), 0);
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Token name is required';
    if (!formData.symbol) newErrors.symbol = 'Token symbol is required';
    if (!formData.initialSupply || parseFloat(formData.initialSupply) <= 0) {
      newErrors.initialSupply = 'Initial supply must be greater than 0';
    }

    const buyTax = parseInt(formData.buyTax);
    const sellTax = parseInt(formData.sellTax);
    if (buyTax < 0 || buyTax > 20) newErrors.buyTax = 'Tax must be 0-20%';
    if (sellTax < 0 || sellTax > 20) newErrors.sellTax = 'Tax must be 0-20%';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    wallets.forEach((wallet, index) => {
      if (!wallet.name) newErrors[`wallet${index}name`] = 'Wallet name required';
      if (!wallet.address) newErrors[`wallet${index}address`] = 'Address required';
      else if (!ethers.isAddress(wallet.address)) newErrors[`wallet${index}address`] = 'Invalid address';

      const share = parseInt(wallet.share);
      if (isNaN(share) || share < 0 || share > 100) {
        newErrors[`wallet${index}share`] = 'Share must be 0-100%';
      }
    });

    const totalShare = getTotalShare();
    if (totalShare !== 100) {
      newErrors.totalShare = `Total must equal 100% (currently ${totalShare}%)`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateContract = () => {
    const featuresList = Object.keys(features).filter(f => features[f]);

    const code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DEvEatsTokenCustomizable.sol";

/**
 * @title ${formData.name}
 * @notice Custom token with DEVeats LP extraction system
 * @dev Generated via DEVeats Contract Generator v2
 *
 * Features enabled: ${featuresList.length > 0 ? featuresList.join(', ') : 'standard'}
 * Tax: ${formData.buyTax}% buy / ${formData.sellTax}% sell
 * Wallets: ${wallets.length}
 */
contract ${formData.symbol}Token is DEVeatsTokenCustomizable {

    constructor() DEVeatsTokenCustomizable(
        "${formData.name}",
        "${formData.symbol}",
        ${formData.initialSupply},
        routerAddress, // Set during deployment
        ${formData.buyTax},
        ${formData.sellTax},
        ${features.burn}, // Burn during extraction
        ${features.maxWallet}, // Max wallet enabled
        ${features.maxTx}, // Max tx enabled
        ${featureSettings.maxWalletPercent}, // Max wallet %
        ${featureSettings.maxTxPercent} // Max tx %
    ) {
        // Add tax wallets
${wallets.map((w, i) => `        addTaxWallet(${w.address}, "${w.name}", ${w.share}); // ${w.name} - ${w.share}%`).join('\n')}
    }
}`;

    setGeneratedCode(code);
    setShowPreview(true);
  };

  const deployContract = async () => {
    alert('Custom features require factory contract upgrade. Deployment coming soon!');
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  // Show token gate if not connected or no access
  if (!isConnected || !hasAccess) {
    return (
      <div className="contract-generator token-gate">
        <div className="gate-content">
          <h1>DEVeats Contract Generator</h1>
          <p className="gate-subtitle">Create custom DEVeats-powered tokens</p>

          <div className="gate-box">
            <div className="gate-icon">🔒</div>
            <h2>Token Required</h2>
            <p>To access the contract generator, you must hold DEVeats tokens.</p>

            <div className="gate-info">
              <p><strong>Token:</strong> DEVeats ($DEVEATS)</p>
              <p><strong>Network:</strong> Base Mainnet</p>
              <p><strong>Contract:</strong> <code>{DEVEATS_TOKEN}</code></p>
            </div>

            <button
              onClick={connectWallet}
              className="connect-btn-large"
              disabled={isCheckingAccess}
            >
              {isCheckingAccess ? 'Checking Access...' : 'Connect Wallet to Verify'}
            </button>

            <div className="gate-links">
              <a href={`https://app.uniswap.org/swap?outputCurrency=${DEVEATS_TOKEN}&chain=base`} target="_blank" rel="noopener noreferrer">
                Buy DEVeats
              </a>
              <a href="/" rel="noopener noreferrer">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contract-generator">
      <div className="generator-header">
        <h1>DEVeats Contract Generator</h1>
        <p className="subtitle">Create fully customized DEVeats-powered tokens</p>
        <p className="fee-info">Deployment Fee: {DEPLOYMENT_FEE} ETH</p>
      </div>

      <div className="progress-steps">
        <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
          <div className="step-number">1</div>
          <div className="step-label">Token Details</div>
        </div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
          <div className="step-number">2</div>
          <div className="step-label">Tax Wallets</div>
        </div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
          <div className="step-number">3</div>
          <div className="step-label">Features</div>
        </div>
        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
          <div className="step-number">4</div>
          <div className="step-label">Review & Deploy</div>
        </div>
      </div>

      <div className="wallet-section">
        <div className="connected-info">
          <span className="connected-indicator">●</span>
          <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
        </div>
      </div>

      <div className="form-section">
        {currentStep === 1 && (
          <div className="step-content">
            <h2>Step 1: Token Details</h2>

            <div className="form-group">
              <label>Network</label>
              <select value={network} onChange={(e) => setNetwork(e.target.value)}>
                <option value="localhost">Localhost (Hardhat)</option>
                <option value="base">Base Mainnet</option>
                <option value="base-sepolia">Base Sepolia (Testnet)</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Token Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., My Awesome Token"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-msg">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Token Symbol *</label>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  placeholder="e.g., MAT"
                  className={errors.symbol ? 'error' : ''}
                />
                {errors.symbol && <span className="error-msg">{errors.symbol}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Initial Supply *</label>
              <input
                type="number"
                name="initialSupply"
                value={formData.initialSupply}
                onChange={handleInputChange}
                placeholder="e.g., 1000000"
                className={errors.initialSupply ? 'error' : ''}
              />
              {errors.initialSupply && <span className="error-msg">{errors.initialSupply}</span>}
              <span className="helper-text">Will be multiplied by 10^18</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Buy Tax (%) *</label>
                <input
                  type="number"
                  name="buyTax"
                  value={formData.buyTax}
                  onChange={handleInputChange}
                  min="0"
                  max="20"
                  className={errors.buyTax ? 'error' : ''}
                />
                {errors.buyTax && <span className="error-msg">{errors.buyTax}</span>}
                <span className="helper-text">0-20% (default: 5%)</span>
              </div>

              <div className="form-group">
                <label>Sell Tax (%) *</label>
                <input
                  type="number"
                  name="sellTax"
                  value={formData.sellTax}
                  onChange={handleInputChange}
                  min="0"
                  max="20"
                  className={errors.sellTax ? 'error' : ''}
                />
                {errors.sellTax && <span className="error-msg">{errors.sellTax}</span>}
                <span className="helper-text">0-20% (default: 5%)</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step-content">
            <h2>Step 2: Tax Distribution Wallets</h2>
            <p className="helper-text">Add wallets that will receive tax distributions. Total must equal 100%.</p>

            {errors.totalShare && (
              <div className="error-banner">{errors.totalShare}</div>
            )}

            <div className="wallets-container">
              {wallets.map((wallet, index) => (
                <div key={index} className="wallet-item">
                  <div className="wallet-header">
                    <h4>Wallet #{index + 1}</h4>
                    {wallets.length > 1 && (
                      <button
                        onClick={() => removeWallet(index)}
                        className="btn-remove"
                        type="button"
                      >
                        × Remove
                      </button>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Wallet Name *</label>
                      <input
                        type="text"
                        value={wallet.name}
                        onChange={(e) => updateWallet(index, 'name', e.target.value)}
                        placeholder="e.g., Development, Marketing"
                        className={errors[`wallet${index}name`] ? 'error' : ''}
                      />
                      {errors[`wallet${index}name`] && (
                        <span className="error-msg">{errors[`wallet${index}name`]}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Share (%) *</label>
                      <input
                        type="number"
                        value={wallet.share}
                        onChange={(e) => updateWallet(index, 'share', e.target.value)}
                        placeholder="25"
                        min="0"
                        max="100"
                        className={errors[`wallet${index}share`] ? 'error' : ''}
                      />
                      {errors[`wallet${index}share`] && (
                        <span className="error-msg">{errors[`wallet${index}share`]}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Wallet Address *</label>
                    <input
                      type="text"
                      value={wallet.address}
                      onChange={(e) => updateWallet(index, 'address', e.target.value)}
                      placeholder="0x..."
                      className={errors[`wallet${index}address`] ? 'error' : ''}
                    />
                    {errors[`wallet${index}address`] && (
                      <span className="error-msg">{errors[`wallet${index}address`]}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={addWallet} className="btn-add-wallet" type="button">
              + Add Another Wallet
            </button>

            <div className="total-share">
              Total Share: {getTotalShare()}% / 100%
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="step-content">
            <h2>Step 3: Optional Features</h2>
            <p className="helper-text">Select additional features for your token</p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-header">
                  <input
                    type="checkbox"
                    id="burn"
                    checked={features.burn}
                    onChange={() => handleFeatureToggle('burn')}
                  />
                  <label htmlFor="burn">
                    <h4>Token Burn During LP Extraction</h4>
                    <p>Burn tokens when extracting ETH from LP (default: enabled)</p>
                  </label>
                </div>
                {features.burn && (
                  <div className="feature-settings">
                    <p style={{fontSize: '0.875rem', color: '#a0aec0', margin: 0}}>
                      When enabled: Tax tokens + LP tokens are burned during extraction (deflationary)
                      <br/>
                      When disabled: Tokens are kept in contract, not burned (non-deflationary)
                    </p>
                  </div>
                )}
              </div>

              <div className="feature-card">
                <div className="feature-header">
                  <input
                    type="checkbox"
                    id="maxWallet"
                    checked={features.maxWallet}
                    onChange={() => handleFeatureToggle('maxWallet')}
                  />
                  <label htmlFor="maxWallet">
                    <h4>Max Wallet</h4>
                    <p>Limit maximum tokens per wallet to prevent whales</p>
                  </label>
                </div>
                {features.maxWallet && (
                  <div className="feature-settings">
                    <label>Max Wallet Percent</label>
                    <input
                      type="number"
                      value={featureSettings.maxWalletPercent}
                      onChange={(e) => handleFeatureSettingChange('maxWalletPercent', e.target.value)}
                      min="1"
                      max="100"
                      placeholder="2"
                    />
                    <span className="helper-text">% of total supply</span>
                  </div>
                )}
              </div>

              <div className="feature-card">
                <div className="feature-header">
                  <input
                    type="checkbox"
                    id="maxTx"
                    checked={features.maxTx}
                    onChange={() => handleFeatureToggle('maxTx')}
                  />
                  <label htmlFor="maxTx">
                    <h4>Max Transaction</h4>
                    <p>Limit maximum tokens per transaction</p>
                  </label>
                </div>
                {features.maxTx && (
                  <div className="feature-settings">
                    <label>Max TX Percent</label>
                    <input
                      type="number"
                      value={featureSettings.maxTxPercent}
                      onChange={(e) => handleFeatureSettingChange('maxTxPercent', e.target.value)}
                      min="0.1"
                      max="100"
                      step="0.1"
                      placeholder="1"
                    />
                    <span className="helper-text">% of total supply</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="step-content">
            <h2>Step 4: Review & Deploy</h2>

            <div className="review-section">
              <h3>Token Configuration</h3>
              <div className="review-item">
                <span>Name:</span>
                <strong>{formData.name}</strong>
              </div>
              <div className="review-item">
                <span>Symbol:</span>
                <strong>{formData.symbol}</strong>
              </div>
              <div className="review-item">
                <span>Supply:</span>
                <strong>{formData.initialSupply}</strong>
              </div>
              <div className="review-item">
                <span>Buy Tax:</span>
                <strong>{formData.buyTax}%</strong>
              </div>
              <div className="review-item">
                <span>Sell Tax:</span>
                <strong>{formData.sellTax}%</strong>
              </div>
            </div>

            <div className="review-section">
              <h3>Tax Wallets ({wallets.length})</h3>
              {wallets.map((wallet, index) => (
                <div key={index} className="review-item">
                  <span>{wallet.name}:</span>
                  <strong>{wallet.share}%</strong>
                  <small>{wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}</small>
                </div>
              ))}
            </div>

            <div className="review-section">
              <h3>Features Enabled</h3>
              {Object.keys(features).filter(f => features[f]).length === 0 ? (
                <p>Standard features only</p>
              ) : (
                Object.keys(features).filter(f => features[f]).map(feature => (
                  <div key={feature} className="review-item">
                    <span>✓ {feature.charAt(0).toUpperCase() + feature.slice(1)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="step-navigation">
          {currentStep > 1 && (
            <button onClick={prevStep} className="btn-secondary">
              ← Previous
            </button>
          )}

          {currentStep < 4 ? (
            <button onClick={nextStep} className="btn-primary">
              Next →
            </button>
          ) : (
            <div className="deploy-actions">
              <button onClick={generateContract} className="btn-secondary">
                Preview Contract
              </button>
              <button
                onClick={deployContract}
                className="btn-primary"
                disabled={isDeploying}
              >
                {isDeploying ? 'Deploying...' : `Deploy for ${DEPLOYMENT_FEE} ETH`}
              </button>
            </div>
          )}
        </div>

        {deploymentStatus && (
          <div className={`status-message ${deployedAddress ? 'success' : ''}`}>
            {deploymentStatus}
          </div>
        )}
      </div>

      {showPreview && (
        <div className="preview-modal">
          <div className="preview-content">
            <div className="preview-header">
              <h2>Generated Contract</h2>
              <button onClick={() => setShowPreview(false)} className="close-btn">×</button>
            </div>
            <pre className="code-preview">{generatedCode}</pre>
            <div className="preview-actions">
              <button onClick={() => copyToClipboard(generatedCode)}>
                Copy Code
              </button>
              <button onClick={() => setShowPreview(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContractGeneratorV2;
