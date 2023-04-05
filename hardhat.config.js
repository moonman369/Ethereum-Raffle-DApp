require('dotenv').config();
require('hardhat-deploy');
require('@nomiclabs/hardhat-waffle');
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 31337,
      accounts: [
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
      ],
      saveDeployments: true,
    },
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 4,
      saveDeployments: true,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY_S],
      chainId: 11155111,
      saveDeployments: true,
    },
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY_G],
      chainId: 5,
      saveDeployments: true,
    },
    w3dev: {
      url: process.env.W3DEV_RPC_URL,
      accounts: [process.env.PRIVATE_KEY_W3],
      chainId: 1313,
      saveDeployments: true,
    },
  },

  namedAccounts: {
    deployer: {
      default: 0,
    },
  },

  solidity: '0.8.7',
};
