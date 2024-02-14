import React, { useEffect, useState } from 'react'
import { ApiServices } from '../services/apiServices'
import Select, { components } from 'react-select';
import { Web3Service } from '../services/moralisService'

const Home = () => {
  const apiServices = new ApiServices()
  const web3Service = new Web3Service()

  //some required variable to manage connected wallet
  const [wallet, setWallet] = useState();
  const [provider, setProvider] = useState("metamask");
  const [chain, setChain] = useState();

  //for dropdown
  const [selectedProvider, setDropdownProvider] = useState("metamask");
  const [selectedChain, setDropdownChain] = useState();

  const [msg, setMsg] = useState("See Result Here");
  const walletList = [
    { label: "Metamask", value: "metamask" },
    { label: "Wallet Connect", value: "walletconnect" },
  ];

  const chainList = [
    { label: "Etheruem (Mainnet)", value: "0x1" },
    { label: "Rinkeby (Testnet)", value: "0x4" },
  ];

  //some required code in page laod 
  useEffect(() => { 
    //code to change account if 
    web3Service.isWeb3Enable();
    web3Service.metamaskAccountChange().then((res)=>{ setWallet(res) })
    web3Service.metamaskChainChange().then((res)=>{ setChain(res) })
    web3Service.isMetamaskUnlocked().then((res)=> {
      if(provider === "metamask" && res === false){
        disconnect()
      }
    });
  }, [])
  
  const listNft = () => {
    //write as per your need
    const param = {}

    const queryString = ""
    apiServices.callNfts(param, queryString)
    .then(response => response.text())
    .then(result => {
      //write your code here
      console.log(result)
      setMsg(result)
    })
    .catch(error => {
      console.error(error);
      setMsg(error)
    });

  }

  const listColl = () => {
    //write as per your need
    const param = {}
    const queryString = ""
    apiServices.callCollections(param, queryString)
    .then(response => response.text())
    .then(result => {
      //write your code here
      console.log(result)
      setMsg(result)
    })
    .catch(error => {
      console.error(error);
      setMsg(error)
    });

  }

  /*
  * Here need to read data from database
  */
  const buy = async () => {

    //verify selected chain must be 0x4 in live 0x1
    await web3Service.verifyChain()
    //always call this first
    //await web3Service.enableWeb3()
    await connectWallet() //because i need connected user... below called buyer, useState wallet, so i will login
    //write as per your need
    const paytoken = "0x0000000000000000000000000000000000000000"
    const trade_type = 0
    const price = await web3Service.getWei(0.001)
    const amount = 4
    const seller = "0x10e624997fbd9f4031c23bc15c70e98b1706d1c1"
    const buyer = '0x81bbF6d5B299AE8De54AB0F819Cd02A08b8968ec' //wallet
    const collectionId = "6281951a939d2dc497c8d682"
    const nonce = new Date().getTime()
    const tokenArr = await web3Service.getTokenNo(seller, amount, nonce, collectionId)
    const tokenBlock = tokenArr[0]
    const tokenTime = tokenArr[1]
    const tokenNo = tokenArr[2]
    const tuple = [
      "https://gateway.ipfs.io/ipfs/QmVdpWzihUvg4D48E5F61vrd4NEEbYYBYMnZeufJWvT7rn",
      amount,
      collectionId,
      seller,
      tokenBlock,
      tokenTime
    ]

    web3Service.buy(tokenNo, price, amount, buyer, seller, paytoken, nonce, tuple, trade_type).then((res)=> {
      if(res[0]){
        console.log("transaction success", res[1])
        setMsg(`Success transaction no. is ${res[1]}}`)
      } else {
        console.error("transaction failed", res[1])
        setMsg('Transaction is failed, retry.')
      }
    }).catch((err)=>{
      console.error(err)
      setMsg(err)
    })

  }

  /*
  * Login to wallet using moralis api
  */
  const connectWallet = async () => {
    web3Service.getWallet(selectedProvider).then(async (connection) => {
      if(connection.length > 0){
        setWallet(connection[0])
        setChain(connection[1])
        setProvider(connection[2])
        setMsg(`Connect wallet address is ${connection[0]} & chain id ${connection[1]} & provider is ${connection[2]}`)
      }
    })
  }

  //this code will return wallet from selected chain on environemental variable,
  // Just pass true on second argument
  const connectVerifiedWallet = async () => {
    web3Service.getWallet(selectedProvider, true).then((connection) => {
      if(connection.length > 0){
        setWallet(connection[0])
        setChain(connection[1])
        setProvider(connection[2])
        setMsg(`Connect wallet address is ${connection[0]} & chain id ${connection[1]} & provider is ${connection[2]}`)
      }
    })
  }

  const getConnectedChain = async () => {
    web3Service.getChain().then((res) => {
      setChain(res)
      setMsg(`connect wallet address is ${wallet} & chain id ${res} & provider is ${provider}`)
    })
  }

  const switchChain = async () => {
    web3Service.switchChain(selectedChain).then((res) => {
      setChain(res)
      setMsg(`connect wallet address is ${wallet} & chain id ${res} & provider is ${provider}`)
    })
  }

  //diconnect wallet
  const disconnect = () => {
    setChain(null)
    setProvider(null)
    setWallet(null)
  }


  //UI data update - like select option
  const handleWalletChange = (selectedOption) => {
    setDropdownProvider(selectedOption.value)
  }

  const handleChainChange = (selectedOption) => {
    setDropdownChain(selectedOption.value)
  }

  return (
    <>
      <label id="result">{msg}</label>
      <br/>
      <label>----------------Test API-----------------</label><br/>
      <button onClick={listNft}>List Nfts</button>
      <button onClick={listColl}>List Collections</button>
      <br/>
      <label>----------------Test Moralis Web3-----------------</label><br/>
      <label htmlFor="wallet_option">Select Wallet:</label>
      <Select id="wallet_option" options={walletList} selectedOption={selectedProvider} onChange={handleWalletChange}/>
      <label htmlFor="chain_option">Select Chain:</label>
      <Select id="chain_option" options={chainList} selectedOption={selectedChain} onChange={handleChainChange}/>
      <hr/>
      <button onClick={connectWallet}>Login Wallet</button>
      <button onClick={connectVerifiedWallet}>Login With Verified Chain</button>
      <button onClick={getConnectedChain}>Get Connected Chain</button>
      <button onClick={switchChain}>Switch Chain</button>
      <button onClick={disconnect}>Disconnect Wallet</button>
      <button onClick={buy}>Call Web3 API - Buy</button>
    </>
  )
}

export default Home
