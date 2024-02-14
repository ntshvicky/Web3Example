# Execute required library
## Required for .env file execution
npm install dotenv --save 

## Required to install web3 for web3 call
npm install --save web3

## Required to install etherjs for call blockchain function through etherjs
npm install --save ethers

## Moralis API 
npm install moralis react-moralis
(https://docs.moralis.io/moralis-dapp/connect-the-sdk/connect-with-react)

## WalletConnect Provider
npm install @walletconnect/web3-provider


#Always remember - web3
1. call enable web3 code in page laod where you need to have execute web3 code, in useEffect
2. Always verify, user must have selected required chain
    Like 0x4 for testnet or development phase
    0x1 for mainnet, production phase
    -------------
    above is based on required blockchain
    Mainnet (Production)    ---              Testnet (Development)
    .......                                 ...........
    Ethereum (0x1)          ---             Rinkeby (0x4)
    Polygon (0x137 / 0x89)  ---             Mumbainet (0x80001 / 0x13881)
    Binance (0x38)          ---             Testnet (0x61)
    Avalanche (0xa86a)      ---             Testnet (0xa869)

3. 
