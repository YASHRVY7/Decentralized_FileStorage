const HDWalletProvider = require('@truffle/hdwallet-provider');

// Replace with your Ganache mnemonic
const mnemonic = "width danger humor bulb shoot crew elegant wrap win wealth reunion parent";

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },
  },
};