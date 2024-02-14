//Required
import { ethers } from "ethers";
import Web3Modal from "web3modal"

//This is wallet integration - import based on your requirement Formatic and Bitski has some error
import WalletConnectProvider from "@walletconnect/web3-provider"; //use for wallet connect integration
//import Fortmatic from "fortmatic"; //uncomment for formatic wallet integration
import WalletLink from "walletlink"; //use for coinbase integration
import Torus from "@toruslabs/torus-embed"; //use for torus integration
//import { Bitski } from "bitski"; //use for bitski integration
import MewConnect from "@myetherwallet/mewconnect-web-client";
import Portis from "@portis/web3";



//Code for setup constant variable for connection metadata
/*
* CHAIN_NAME - use mainnet for live application/Use testnet for testnet
* CHAIN_ID - 4 for rinkeby 1 for mainnet ethereum
* INFURA_ID - generate infura id from infura.io
* INFURA_RPCURL - infura api url to connect contract
*/
const PROJECT_NAME = "Project Name"
const CHAIN_NAME = "rinkeby" //or mainnet rinkby, kovan,binance etc.
const CHAIN_ID = 4
const CHAIN_HASH = "0x4"
const INFURA_ID = process.env.INFURA_KEY
const INFURA_RPCURL = `https://${CHAIN_NAME}.infura.io/v3/${INFURA_ID}` //rinkeby
const PRIVATE_KEY = process.env.PRIVATE_KEY//signer PK - This is my (nitish) metamask private key"

// Infura setting for formatic:
const customNetworkOptions = {
    rpcUrl: INFURA_RPCURL,
    chainId: CHAIN_ID
}

//Required - add wallet here - like first one is setting for wallet connect 
// beacuse of this variable you can see wallets on model
// Metamask default
const providerOptions = {
    walletconnect: {
          package: WalletConnectProvider,
          options: {
            infuraId: INFURA_ID // required
        }
    },
    walletlink: {
        package: WalletLink, // Required
        options: {
          appName: PROJECT_NAME, // Required - Project Name
          infuraId: INFURA_ID, // Required unless you provide a JSON RPC url; see `rpc` below
          rpc: INFURA_RPCURL, // Optional if `infuraId` is provided; otherwise it's required
          chainId: CHAIN_ID, // Optional. It defaults to 1 if not provided
          appLogoUrl: null, // Optional. Application logo image URL. favicon is used if unspecified
          darkMode: false // Optional. Use dark theme, defaults to false
        }
    },
    torus: {
        package: Torus, // required
        options: {
          networkParams: {
            host: INFURA_RPCURL, // optional
            chainId: CHAIN_ID, // optional
            networkId: CHAIN_ID // optional
          }
        }
      },
    /*bitski: {
        package: Bitski, // required
        options: {
          clientId: "5924e993-72bd-4cb1-ae3c-5e7cafab7c11", // required
          callbackUrl: "http://localhost:3000/callback/bitski" // required
        }
      },*/
    mewconnect: {
        package: MewConnect, // required
        options: {
          infuraId: INFURA_ID // required
        }
      },
    portis: {
        package: Portis, // required
        options: {
          id: "99b5da4a-bd0a-4258-a7e4-573a4d78967b" // required
        }
      }
};


//Initialized Web3Model
const web3Modal = new Web3Modal({
    network: CHAIN_NAME, // optional
    cacheProvider: true, // optional
    providerOptions // required
});


export class Web3Service {

 //Login - use logic and add your statement
 login = async () => {
    const instance = await web3Modal.connect();
    const currentProvider = new ethers.providers.Web3Provider(instance);
    console.log("provider", currentProvider)
    if(parseInt(currentProvider.provider.chainId) != CHAIN_ID) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_HASH }]
      });
    }
    //const signer = provider.getSigner();
    //console.log("signer", signer)
    if(currentProvider.provider.isMetaMask){
        return [currentProvider.provider.selectedAddress, parseInt(currentProvider.provider.chainId), "metamask", instance, currentProvider]
    }
    else if(currentProvider.provider.isWalletConnect){
        return [currentProvider.provider.accounts[0], parseInt(currentProvider.provider.chainId), "walletconnect", instance, currentProvider]
        
    }
    else if(currentProvider.provider.isCoinbaseWallet){
        return [currentProvider.provider.selectedAddress, parseInt(currentProvider.provider.chainId), "coinbase", instance, currentProvider]
        
    }
    else if(currentProvider.provider.isTorus){
        return [currentProvider.provider.selectedAddress, parseInt(currentProvider.provider.chainId), "torus", instance, currentProvider]
        
    }
    else if(currentProvider.provider.isPortis){
        return [currentProvider.provider._portis._web3ManagerInstance._selectedAddress, CHAIN_ID, "portis", instance, currentProvider]
    }
    /*
    //uncomment for formatic wallet
    else if(currentProvider.provider.isFortmatic){
        const web3 = new Web3(currentProvider)
        console.log(web3)
        console.log(web3.pro)
        
    }*/
    subscribeProvider(instance)

    return null
}

logout = async () => {
    await web3Modal.clearCachedProvider(); // required
}

subscribeProvider = async (provider) => {
    if (!provider.on) {
      return;
    }
    /* 
      * Function to handle wallet state 
      * Only gonna work with Metamask
      */
      // Subscribe to accounts change
      provider.on("accountsChanged",  (accounts) => {
        setUser(accounts[0])
      });

      // Subscribe to chainId change
      provider.on("chainChanged",  (chainId) => {
        console.log("Changed Chain", chainId)
        if(chainId != CHAIN_ID) {
          window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: CHAIN_HASH }]
          }).then(()=>{
            setChainId(parseInt(chainId))
          })
        } else {
          setChainId(parseInt(chainId))
        }
      });

      // Subscribe to provider connection
      provider.on("connect",  (info) => {
        login()
      });

      // Subscribe to provider disconnection
      provider.on("disconnect",  (error) => {
        logout()
      });
  };


 
    /*

    * Call contract read function example
    * Example from watch mint

    */
    signSignature = async (contractType, contractAddr, __tokenId, __amount, nonce, provider_arr) => {


      try{

        //code to generate signtare hash from contract

        //generate hash value

        const ABI = [

          {

              "inputs": [
                  {
                      "internalType": "address",
                      "name": "_to",
                      "type": "address"
                  },
                  {
                      "internalType": "uint256",
                      "name": "_tokenId",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "_amount",
                      "type": "uint256"
                  },
                  {
                      "internalType": "uint256",
                      "name": "_nonce",
                      "type": "uint256"
                  }

              ],

              "name": "getMessageHash",
              "outputs": [
                  {
                      "internalType": "uint256",
                      "name": "",
                      "type": "uint256"
                  },
                  {
                      "internalType": "bytes32",
                      "name": "",
                      "type": "bytes32"
                  }
              ],

              "stateMutability": "view",
              "type": "function"

          }];


          const contract = new ethers.Contract(contractAddr, ABI, provider_arr[4]);

          const tx = await contract.getMessageHash(provider_arr[0], __tokenId, __amount, nonce, { gasPrice: 20e9 })

      
          console.log(parseInt(tx[0]), tx[1])


          //signer private key
          const signingKey = new ethers.utils.SigningKey(PRIVATE_KEY);

          console.log("signingKey", signingKey)

          let deployTx = signingKey.signDigest(tx[1]);

          console.log("deployTx", deployTx)


          const signature = ethers.utils.joinSignature(deployTx);

          console.log("Signature", signature);

          var res = [false, null];

          if(contractType == "premium") {

            res  = await this.mintPremium(contractAddr, __tokenId, nonce, tx[0], signature, provider_arr[4])

          } else {

            res = await this.mintNonePremium(contractAddr, __tokenId, __amount, nonce, tx[0], signature, provider_arr[4])

          }

          return res

        }

        catch(ex) {

          console.log(`Exception on Minting - ${ex}`)
          return [false, (ex.error==undefined?ex.message:ex.error['message']) ]

      }


   }



   //Example of minting 

   mintPremium = async (contractAddr, __tokenId, nonce, ethprice, signature, provider) => {

     try{

      const ABI = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_nonce",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "signature",
                    "type": "bytes"
                }
            ],

            "name": "mint",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"

        }];


        // MetaMask requires requesting permission to connect users accounts

        //await provider.send("eth_requestAccounts", []);

        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddr, ABI, signer);
        const tx = await contract.mint(__tokenId, nonce, signature, { value: ethprice, gasPrice: 20e9 })
        const reciept = await tx.wait(); //it will wait for transaction to complete on etherscan

        console.log(tx, reciept, reciept.transactionHash)
        return [true, reciept]

      }

      catch(ex) {

          console.log(`Exception on Minting - ${ex}`)
          return [false, (ex.error==undefined?ex.message:ex.error['message']) ]

      }

  }


  //Example of minting 

  mintNonePremium = async (contractAddr, __tokenId, __amount, nonce, ethprice, signature, provider) => {

    try{

      const ABI = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_amount",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "_nonce",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "signature",
                    "type": "bytes"
                }
            ],

            "name": "mint",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }];

        //await provider.send("eth_requestAccounts", []);

        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddr, ABI, signer);
        const tx = await contract.mint(__tokenId, __amount, nonce, signature, { value: ethprice, gasPrice: 20e9 })
        const reciept = await tx.wait(); //it will wait for transaction to complete on etherscan
        console.log(tx, reciept, reciept.transactionHash)

        console.log(`Minting done with transaction no - ${reciept.transactionHash}`)
        return [true, reciept]

      }

      catch(ex) {

        console.log(`Exception on Minting - ${ex}`)
        return [false, (ex.error==undefined?ex.message:ex.error['message']) ]

    }

    }



}