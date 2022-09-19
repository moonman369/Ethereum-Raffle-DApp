require("hardhat-deploy");
require("dotenv").config();
require("@nomiclabs/hardhat-waffle");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    rinkeby: {
      url: process.env.RINKEBY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 4,
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

  solidity: "0.8.7",
};
