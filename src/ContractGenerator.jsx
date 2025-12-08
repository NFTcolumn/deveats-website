import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './ContractGenerator.css';

const DEVEATS_TOKEN = '0xa4C4391bF643EbC391c9848453873656e1Fbd9d5'; // Base mainnet
const DEVEATS_ABI = [
  "function balanceOf(address account) external view returns (uint256)"
];

const FACTORY_ABI = [
  "function deployToken(string memory _name, string memory _symbol, uint256 _initialSupply, address _routerAddress, address _devWallet, address _marketingWallet, address _buybackWallet, address _charityWallet) external payable returns (address)",
  "function DEPLOYMENT_FEE() external view returns (uint256)",
  "function deployedTokens(uint256) external view returns (address)",
  "function getDeployedTokenCount() external view returns (uint256)",
  "function deploymentInfo(address) external view returns (address deployer, string memory name, string memory symbol, uint256 initialSupply, uint256 timestamp, address routerAddress)"
];

const NETWORKS = {
  'base': {
    name: 'Base Mainnet',
    chainId: 8453,
    rpcUrl: 'https://mainnet.base.org',
    routerAddress: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
    factoryAddress: '', // Will be deployed
    explorer: 'https://basescan.org',
    requiresToken: true
  }
};

const DEPLOYMENT_FEE = '0.0005';

function ContractGenerator() {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    initialSupply: '',
    devWallet: '',
    marketingWallet: '',
    buybackWallet: '',
    charityWallet: ''
  });

  const [network, setNetwork] = useState('base');
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

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const checkTokenBalance = async (address) => {
    try {
      const provider = new ethers.JsonRpcProvider(NETWORKS['base'].rpcUrl);
      const tokenContract = new ethers.Contract(DEVEATS_TOKEN, DEVEATS_ABI, provider);
      const balance = await tokenContract.balanceOf(address);

      // Require at least 1,000 tokens (assuming 18 decimals)
      const requiredBalance = ethers.parseUnits('1000', 18);
      return balance >= requiredBalance;
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

      // Prompt user to sign a message to verify wallet ownership
      const message = `Welcome to DEVeats Contract Generator!\n\nPlease sign this message to verify wallet ownership.\n\nWallet: ${address}\nTimestamp: ${new Date().toISOString()}`;

      try {
        const signature = await signer.signMessage(message);
        console.log('Signature verified:', signature);
      } catch (signError) {
        console.error('Signature rejected:', signError);
        alert('You must sign the message to connect your wallet.');
        setIsCheckingAccess(false);
        return;
      }

      setAccount(address);
      setIsConnected(true);

      // Check if network requires token
      if (NETWORKS[network].requiresToken) {
        const hasToken = await checkTokenBalance(address);
        if (!hasToken) {
          setHasAccess(false);
          setIsConnected(false);
          setAccount(null);
          alert('Access Denied: You must hold at least 1,000 DEVeats tokens to use this generator.\n\nBuy $DEVeats on Uniswap: https://app.uniswap.org/swap?outputCurrency=' + DEVEATS_TOKEN + '&chain=base');
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
      // Chain doesn't exist, add it
      if (error.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: targetNetwork.name,
              rpcUrls: [targetNetwork.rpcUrl],
              blockExplorerUrls: [targetNetwork.explorer]
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
    // Clear error for this field
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Token name is required';
    if (!formData.symbol) newErrors.symbol = 'Token symbol is required';
    if (!formData.initialSupply || parseFloat(formData.initialSupply) <= 0) {
      newErrors.initialSupply = 'Initial supply must be greater than 0';
    }

    const walletFields = ['devWallet', 'marketingWallet', 'buybackWallet', 'charityWallet'];
    walletFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Required';
      } else if (!ethers.isAddress(formData[field])) {
        newErrors[field] = 'Invalid address';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateContract = () => {
    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    const code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./DEvEatsTax.sol";

/**
 * @title ${formData.name}
 * @notice Custom token using DEVeats Protocol
 * @dev Generated via DEVeats Contract Generator
 */
contract ${formData.symbol}Token is DEVeatsTax {

    constructor(
        uint256 initialSupply,
        address routerAddress,
        address _devWallet,
        address _marketingWallet,
        address _buybackWallet,
        address _charityWallet
    ) {
        // Set token details
        name = "${formData.name}";
        symbol = "${formData.symbol}";

        // Set supply and give to deployer
        _totalSupply = initialSupply * 10**decimals;
        _balances[msg.sender] = _totalSupply;

        // Initialize DEVeats tax system
        _initializeDEvEatsTax(
            routerAddress,
            _devWallet,
            _marketingWallet,
            _buybackWallet,
            _charityWallet
        );

        emit Transfer(address(0), msg.sender, _totalSupply);
    }
}`;

    setGeneratedCode(code);
    setShowPreview(true);
  };

  const deployContract = async () => {
    if (!validateForm()) {
      alert('Please fix the errors in the form');
      return;
    }

    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }

    const targetNetwork = NETWORKS[network];
    if (!targetNetwork.factoryAddress) {
      alert('Factory contract not deployed on this network yet. Please check back later or deploy manually.');
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus('Preparing deployment...');

    try {
      await switchNetwork();

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      setDeploymentStatus('Connecting to factory contract...');
      const factory = new ethers.Contract(
        targetNetwork.factoryAddress,
        FACTORY_ABI,
        signer
      );

      setDeploymentStatus('Requesting deployment approval...');
      const deploymentFee = ethers.parseEther(DEPLOYMENT_FEE);

      const tx = await factory.deployToken(
        formData.name,
        formData.symbol,
        formData.initialSupply,
        targetNetwork.routerAddress,
        formData.devWallet,
        formData.marketingWallet,
        formData.buybackWallet,
        formData.charityWallet,
        { value: deploymentFee }
      );

      setDeploymentStatus('Deploying contract... Please wait for confirmation.');
      const receipt = await tx.wait();

      // Parse the TokenDeployed event
      const event = receipt.logs.find(log => {
        try {
          const parsed = factory.interface.parseLog(log);
          return parsed.name === 'TokenDeployed';
        } catch {
          return false;
        }
      });

      if (event) {
        const parsed = factory.interface.parseLog(event);
        const tokenAddress = parsed.args.tokenAddress;
        setDeployedAddress(tokenAddress);
        setDeploymentStatus(`Success! Contract deployed at ${tokenAddress}`);
      } else {
        setDeploymentStatus('Contract deployed successfully!');
      }

    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentStatus('Deployment failed: ' + error.message);
    } finally {
      setIsDeploying(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="contract-generator">
      <div className="generator-header">
        <h1>DEVeats Contract Generator</h1>
        <p className="subtitle">Create your own DEVeats-powered token in minutes</p>
        <p className="fee-info">Deployment Fee: {DEPLOYMENT_FEE} ETH (split 50/50 between protocol creators)</p>
      </div>

      <div className="wallet-section">
        {!isConnected ? (
          <button onClick={connectWallet} className="connect-btn" disabled={isCheckingAccess}>
            {isCheckingAccess ? 'Checking Access...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="connected-info">
            <span className="connected-indicator">●</span>
            <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
          </div>
        )}
      </div>

      <div className="form-section">
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

        <div className="wallet-inputs">
          <h3>Team Wallet Addresses</h3>
          <p className="helper-text">These wallets will receive ETH from the tax system</p>

          <div className="form-group">
            <label>Dev Wallet *</label>
            <input
              type="text"
              name="devWallet"
              value={formData.devWallet}
              onChange={handleInputChange}
              placeholder="0x..."
              className={errors.devWallet ? 'error' : ''}
            />
            {errors.devWallet && <span className="error-msg">{errors.devWallet}</span>}
          </div>

          <div className="form-group">
            <label>Marketing Wallet *</label>
            <input
              type="text"
              name="marketingWallet"
              value={formData.marketingWallet}
              onChange={handleInputChange}
              placeholder="0x..."
              className={errors.marketingWallet ? 'error' : ''}
            />
            {errors.marketingWallet && <span className="error-msg">{errors.marketingWallet}</span>}
          </div>

          <div className="form-group">
            <label>Buyback Wallet *</label>
            <input
              type="text"
              name="buybackWallet"
              value={formData.buybackWallet}
              onChange={handleInputChange}
              placeholder="0x..."
              className={errors.buybackWallet ? 'error' : ''}
            />
            {errors.buybackWallet && <span className="error-msg">{errors.buybackWallet}</span>}
          </div>

          <div className="form-group">
            <label>Charity Wallet *</label>
            <input
              type="text"
              name="charityWallet"
              value={formData.charityWallet}
              onChange={handleInputChange}
              placeholder="0x..."
              className={errors.charityWallet ? 'error' : ''}
            />
            {errors.charityWallet && <span className="error-msg">{errors.charityWallet}</span>}
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={generateContract} className="btn-secondary">
            Preview Contract
          </button>
          <button
            onClick={deployContract}
            className="btn-primary"
            disabled={isDeploying || !isConnected}
          >
            {isDeploying ? 'Deploying...' : `Deploy for ${DEPLOYMENT_FEE} ETH`}
          </button>
        </div>

        {deploymentStatus && (
          <div className={`status-message ${deployedAddress ? 'success' : ''}`}>
            {deploymentStatus}
            {deployedAddress && (
              <div className="deployed-links">
                <button onClick={() => copyToClipboard(deployedAddress)}>
                  Copy Address
                </button>
                <a
                  href={`${NETWORKS[network].explorer}/address/${deployedAddress}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Explorer
                </a>
              </div>
            )}
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

      <div className="info-section">
        <h3>How It Works</h3>
        <ol>
          <li>Fill in your token details and team wallet addresses</li>
          <li>Preview your contract code (optional)</li>
          <li>Connect your wallet and deploy</li>
          <li>Pay 0.0005 ETH deployment fee</li>
          <li>Receive your fully-functional DEVeats token</li>
        </ol>

        <div className="features">
          <h3>What You Get</h3>
          <ul>
            <li>✓ 5% default buy/sell tax</li>
            <li>✓ Automatic LP extraction system</li>
            <li>✓ ETH distribution to your team wallets</li>
            <li>✓ LP burning mechanism</li>
            <li>✓ No token dumping</li>
            <li>✓ Fully customizable tax rates</li>
            <li>✓ Owner controls</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ContractGenerator;
