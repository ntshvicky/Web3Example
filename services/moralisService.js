import { ethers } from "ethers";

export const Moralis = require('moralis');

/*
* You can write all web3 based call here
* so, no need to rewrite in every page, like mint function
*/
export class Web3Service {

    
    // Better practice to use this thing from .env, find solution
    CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS
    SIGNER_KEY = process.env.PRIVATE_KEY
    CHAIN_ID = 4
    CHAIN_HASH = "0x4"

    //Connected User Data

    getWei = async (price) => {
        return Moralis.Units.ETH(price, 18)
    }

    enableWeb3 = async () => {
        await Moralis.enableWeb3(); 
    }

    //check if web3 is enable, either enable it
    //Call this function always
    isWeb3Enable = async () => {
        if(Moralis.isWeb3Enabled() == false) {
            try{
                await this.enableWeb3()
            } catch(err){
                console.error("Error isWeb3Enable", err)
            }
        }
    }

    //return connected user and chain id
    getWallet = async (providerName="metamask", verifyChain=false) => {
        try {
            if(verifyChain){
                await this.verifyChain()
            }
            const web3Provider = await Moralis.enableWeb3({ provider: providerName });
            if(web3Provider.provider.constructor.name === "WalletConnectProvider"){
                return [web3Provider.provider.accounts[0], ethers.utils.hexValue(web3Provider.provider.chainId), providerName]
            }
            return [web3Provider.provider.selectedAddress, web3Provider.provider.chainId, providerName]
        } catch(err) {
            console.error("Error getWallet: Web3 Initialization Execption", err)
            return []
        }
    }

    //return web3Provider 
    getChain = async () => {
        try {
            const chainId = await Moralis.chainId;
            return chainId
        } catch(err) {
            console.error("Error getChain: Web3 Initialization Execption", err)
            return null
        }
    }

    verifyChain = async () => {
        const chainId = await Moralis.chainId;
        if(parseInt(chainId)!=this.CHAIN_ID){
            await this.switchChain(this.CHAIN_HASH)
        }
    }

    //return web3Provider 
    switchChain = async (chainId) => {
        try {
            await Moralis.switchNetwork(chainId);
            await this.enableWeb3() //need to call due to relogin after network change
            return chainId
        } catch(err) {
            console.error("Error switchChain: Web3 Initialization Execption", err)
            return chainId
        }
    }

    //execute when user change acccount on metamask
    metamaskAccountChange = async () => {
        ethereum.on('accountsChanged', (accounts) => {
            return accounts
        });
        return null
    }

    //execute when user change chain on metamask
    metamaskChainChange = async () => {
        ethereum.on('chainChanged', (chain) => {
            return chain
        });
        return null
    }

    isMetamaskUnlocked = async () => {
        ethereum._metamask.isUnlocked().then((res)=> {
            console.log("is metamask connected: ", res)
            return res
        })
    }

    /*
    *   Return current gas price 
    */
    getGasPrice = async (provider="metamask") => {
        const web3Provider = await Moralis.enableWeb3({ provider: provider });
        return await web3Provider.getGasPrice();
    }

    //function to check if contract is approved to access token
    // You can modify condition as per your need
    isApprovedForAll = async (account, operator, provider = "metamask") => {

        const ABI =  [{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"}]

        const readOptions = {
            contractAddress: this.CONTRACT_ADDRESS,
            chainId: this.CHAIN_ID,
            functionName: "isApprovedForAll",
            abi: ABI,
            params: {
                account: account, 
                operator: operator
            }
        };
        return await Moralis.executeFunction(readOptions);
    }

    //function to approve to access token
    // You can modify condition as per your need
    // if operator address is constant, no need to pass in argument, but declare here
    setApprovalForAll = async (account, operator, approved = true, providerName = "metamask") => {

        if(!this.isApprovedForAll(account, operator)){
            const ABI =  [{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"}]

            const writeOptions = {
                contractAddress: this.CONTRACT_ADDRESS,
                chainId: this.CHAIN_ID,
                functionName: "setApprovalForAll",
                abi: ABI,
                params: {
                    operator: operator, 
                    approved: approved
                }
            };
            const receipt  = await Moralis.executeFunction(writeOptions)
            await receipt.wait()
            return receipt
        } else {
            return "already aproved"
        }
    }

    getTokenNo = async (creator, amount, nonce, collectionId) => {
        //first verify .. selected chain is as above define
        const readOptions = {
            contractAddress: this.CONTRACT_ADDRESS,
            functionName: "genTokenHash",
            abi: [{"inputs":[{"internalType":"address","name":"_creator","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"uint256","name":"_nonce","type":"uint256"},{"internalType":"string","name":"_collectionId","type":"string"}],"name":"genTokenHash","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
            params: {
                _creator: creator,
                _amount: amount,
                _nonce: nonce,
                _collectionId: collectionId
            }
        };
        const message = await Moralis.executeFunction(readOptions);
        //console.log(message, "Token Details")
        return message
    }

    //function to approve to access token
    // You can modify condition as per your need
    // if operator address is constant, no need to pass in argument, but declare here
    buy = async (tokenNo, price, amount, buyer, seller, paytoken, nonce, tuple, trade_type, providerName = "metamask") => {
        try{
            const ABI = [{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_buyer","type":"address"},{"internalType":"address payable","name":"_seller","type":"address"},{"internalType":"address","name":"_pToken","type":"address"},{"internalType":"uint256","name":"_nonce","type":"uint256"},{"components":[{"internalType":"string","name":"tokenURI","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"collectionId","type":"string"},{"internalType":"address","name":"creator","type":"address"},{"internalType":"uint256","name":"blockNumber","type":"uint256"},{"internalType":"uint256","name":"blockTime","type":"uint256"}],"internalType":"struct Marketplace.Token","name":"_token","type":"tuple"},{"internalType":"uint8","name":"_tradeType","type":"uint8"}],"name":"buyAndAccept","outputs":[],"stateMutability":"payable","type":"function"}];

            const writeOptions = {
                contractAddress: this.CONTRACT_ADDRESS,
                functionName: "buyAndAccept",
                abi: ABI,
                params: {
                    _tokenId: tokenNo,
                    _price: price,
                    _amount: amount,
                    _buyer: buyer,
                    _seller: seller,
                    _pToken: paytoken,
                    _nonce: nonce, //read from db
                    _token: tuple,
                    _tradeType: trade_type
                },
                msgValue: paytoken != "0x0000000000000000000000000000000000000000"? 0: price * amount
            };
            const tx = await Moralis.executeFunction(writeOptions);
            console.log("Before wait: ", tx)
            await tx.wait();
            return [true, tx.hash ]
        } catch(err) {
            return [false, err ]
        }
    }

    

}