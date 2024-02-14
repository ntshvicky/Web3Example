import React, { useState , useEffect} from "react"

//Required
import { ethers } from "ethers";
import { Web3Service } from "../services/web3ModelService";

//Your react component
const About = () =>{

    const web3Service = new Web3Service()
    
  //Example to set state
    const [user, setUser] = useState(null)
    const [providerInstance, setProviderInstance] = useState(null)
    const [chainid, setChainId] = useState(null)
    const [wallet, setWallet] = useState(null)
    const [provider, setProvider] = useState(null) //provider required to use over page
    const [msg, setMsg] = useState(false)
    const [pMsg, setProcessingMsg] = useState(false)
    const [dMsg, setDoneMsg] = useState(false)
    const [eMsg, setErrorMsg] = useState(false)

    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
      if(providerInstance != null && providerInstance != undefined){
        web3Service.subscribeProvider(providerInstance)
      }
    });


     //Login - use logic and add your statement
    const login = async () => {
        const loginInstance = await web3Service.login()
        if(loginInstance !== null){
          setUser(loginInstance[0])
          setChainId(loginInstance[1])
          setWallet(loginInstance[2])
          setProviderInstance(loginInstance[4])
          await web3Service.subscribeProvider(loginInstance[4])
        }
    }

    //Logout - write your own logic
    const logout = async () => {
        
        await web3Service.logout()
        setProvider(null) // required - initialized on state
        setUser(null)
        setChainId(null)
        setWallet(null)
        setMsg(null)
        setDoneMsg(false)
        setErrorMsg(false)
        setProcessingMsg(false)
    }


    //Example of watch to create signature using ether.js
    /*
    * Signtaure only gonna work on metamask - required to install metamask
    */
    const execMint = async (contractType, contractAddr) => {

      try{
            let provider_arr = await web3Service.login()
            let contractAddress = contractAddr;
            let __tokenId = contractType=="premium"? 564 : 1; //it is token id, i am using static for example
            let __amount = 1; //it is how many quantity user want to mint per token

            setErrorMsg(false)
            setProcessingMsg(true)
            setDoneMsg(false)
            setMsg("Generating signature")

            console.debug("Generating signature")
            let nonce = new Date().getTime()
            console.log("nonce", nonce)

            const res = await web3Service.signSignature(contractType, contractAddress, __tokenId, __amount, nonce, provider_arr)
            console.log("res", res)
            if(res[0] === true){
                setErrorMsg(false)
                setProcessingMsg(false)
                setDoneMsg(true)
                setMsg(`Minting done with transaction no - ${res[1].transactionHash}`)
            }
            else {
                setErrorMsg(true)
                setProcessingMsg(false)
                setDoneMsg(false)
                setMsg(`Exception on Minting - ${res[1]}`)
            }
        
        }
        catch(ex) {
          setErrorMsg(true)
          setProcessingMsg(false)
          setDoneMsg(false)
          setMsg(`Exception on Signature Step - ${(ex.error==undefined?ex.message:ex.error['message'])}`)
        }


   }


   //Example of minting 
   const mintPremium = async (contractAddr, __tokenId, nonce, ethprice, signature) => {
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

        setErrorMsg(false)
        setProcessingMsg(true)
        setDoneMsg(false)
        setMsg("Minting on blockchain")

        // MetaMask requires requesting permission to connect users accounts
        //await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddr, ABI, signer);
        const tx = await contract.mint(__tokenId, nonce, signature, { value: ethprice, gasPrice: 20e9 })
        const reciept = await tx.wait(); //it will wait for transaction to complete on etherscan
        console.log(tx, reciept, reciept.transactionHash)

        setErrorMsg(false)
        setProcessingMsg(false)
        setDoneMsg(true)
        setMsg(`Minting done with transaction no - ${reciept.transactionHash}`)

      }
      catch(e) {
          setErrorMsg(true)
          setProcessingMsg(false)
          setDoneMsg(false)
          setMsg(`Exception on Minting - ${e.message}`)
      }
  }

  //Example of minting 
  const mintNonePremium = async (contractAddr, __tokenId, __amount, nonce, ethprice, signature) => {
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

        setErrorMsg(false)
        setProcessingMsg(true)
        setDoneMsg(false)
        setMsg("Minting on blockchain")

        //await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddr, ABI, signer);
        const tx = await contract.mint(__tokenId, __amount, nonce, signature, { value: ethprice, gasPrice: 20e9 })
        const reciept = await tx.wait(); //it will wait for transaction to complete on etherscan
        console.log(tx, reciept, reciept.transactionHash)

        setErrorMsg(false)
        setProcessingMsg(false)
        setDoneMsg(true)
        setMsg(`Minting done with transaction no - ${reciept.transactionHash}`)
      }
      catch(e) {
          setErrorMsg(true)
          setProcessingMsg(false)
          setDoneMsg(false)
          setMsg(`Exception on Minting - ${e.message}`)
      }
    }


    return(
        <div style={{marginTop: "40px"}}>
            { user!=null? <div>
                    <h1> Selected Address: {user} </h1>
                    <br/>
                    <h1> Selected Chain: {chainid} </h1>
                    <br/>
                    <h1> Connected Wallet: {wallet} </h1>
                    <br/>
                    { eMsg ? <span style={{color: "red", fontWeight: "bold"}}><i className='fa fa-times'></i> {msg}</span> : null }
                    { dMsg ? <span style={{color: "green", fontWeight: "bold"}}><i className='fa fa-check'></i> {msg}</span> : null }
                    { pMsg ? <span style={{color: "black", fontWeight: "bold"}}><i className='fa fa-spinner fa-spin'></i> {msg}</span> : null }
                    <br/>
                    <button className="btn btn-danger" onClick={()=>execMint("premium", "0xb97b3058fdFEfefa002Ab036570B177739888b6B")}>Mint Premium</button>
                    <br/>
                    <button className="btn btn-danger" onClick={()=>execMint("regular", "0x393EC9793105001F59BAB8FA8Fc73076a044C754")}>Mint Regular</button>
                    <br/>
                    <button className="btn btn-danger" onClick={()=>execMint("fractional", "0xEA500a52a0D6edECE7B93b17c0a85ef3F93dc002")}>Mint Fractional</button>
                    <br/>
                    <button className="btn" onClick={logout}>Logout</button>
                </div> :  <div><button className="btn" onClick={login}>Connect Wallet</button>
                            <br/>
                            <button className="btn" onClick={logout}>Logout</button>
                          </div>
            }
        </div>
    )
}
export default About;