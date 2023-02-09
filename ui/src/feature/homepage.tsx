import * as React from "react";

import { getApi } from "../api/config/utils";
import { useSubstrate } from "../api/providers/connectContext";

import Button from "@mui/material/Button";
import { web3FromAddress } from "@polkadot/extension-dapp";
import Hidden from "@mui/material/Hidden";
import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import {ContractPromise } from "@polkadot/api-contract";

import metadata from "../metadata/metadata.json";



export default function HomePage() {
  const { getExtension, accounts } = useSubstrate();

  const [walletState, setWalletState] = React.useState<string>("");
  const [account, setAccount] = React.useState<string | undefined>(undefined);
  const [isShown, setIsShown] = React.useState<boolean>(false);
  const [hidden, setHidden] = React.useState<boolean>(false);
  const [apiBC, setApiBC] = React.useState<any>();



  //  Counter is a state initialized to 0
  const [counter, setCounter] = React.useState<any>(0);

  const handleClickPolkadot = () => {
    setHidden(true);
  };

  const walletOptions = [
    <Button key="polkadot" onClick={handleClickPolkadot}>
      PolkadotJs
    </Button>,
  ];

  const callApi = async () => {
    const api = await getApi();

    setApiBC(api);
  };

  const getCount = async () => {
    const value = await getValue();
    console.log(value);
    setCounter(value);
  };


  React.useEffect(() => {
    callApi();
    getExtension();
    
  }, []);

  const handleConnect = () => {
    setIsShown((current) => !current);
  };

  React.useEffect(() => {
    const interval = setInterval(async () => {
      getCount();
      //Count checking interval 2sec
    }, 2000);
    return () => {
      clearInterval(interval);
    };
  });

  const chooseAccount = (id: any) => {
    let acc = accounts.find((acc, index) => id == index);
    console.log(acc?.address);
    setAccount(acc?.address);
    setHidden(false);
    setIsShown(false);
    if (acc?.address) {
      localStorage.setItem("chosen_account", id);
    }
  };

  // get specific account
  let idAccount = localStorage.getItem("chosen_account");
  let index =parseInt(idAccount as string);


  // maximum gas to be consumed for the instantiation. if limit is too small the instantiation will fail.
  const gasLimit = 100000 * 1000000;
  // a limit to how much Balance to be used to pay for the storage created by the instantiation
  // if null is passed, unlimited balance can be used
  const storageDepositLimit = null;
  console.log("Contract address 1:",process.env.REACT_APP_CONTRACT_ADDRESS );

  // Query value from smart contract 
  const getValue = async () => {

    if (apiBC) {

      const contract = new ContractPromise(apiBC, metadata, process.env.REACT_APP_CONTRACT_ADDRESS as string);

      const res = await (new Promise (async (resolve, reject) =>{
        
        try {
          console.log(contract.address.toHuman());
          const {result, output} = await contract.query.get(
            accounts[index].address,
            {
                gasLimit,
                storageDepositLimit,
            }
            );
            
            // check if the call was successful
            if (result.isOk) {
                // output the return value
                console.log('Success -> Value:', output?.toHuman());
                resolve(output?.toHuman());
            } else {
                
                reject(result.asErr);
                
            }
        }
  
        catch (error) {
          reject(error)
        }
      
      }));
  
      console.log(await res);
      return res;
    }

  }
  const handleInc = async () => {
    
    if ((accounts !== null ) && idAccount) {

      //Define deployed contract with metadata + contract address
      const contract = new ContractPromise(apiBC, metadata, process.env.REACT_APP_CONTRACT_ADDRESS as string);
      const injector = await web3FromAddress(accounts[index].address);
      console.log("Contract:", contract.address.toString());
      console.log("Contract address:",process.env.REACT_APP_CONTRACT_ADDRESS );
      await contract.tx.inc({ storageDepositLimit, gasLimit })
      .signAndSend(accounts[index].address,
        { signer: injector?.signer }, result => {
      if (result.status.isFinalized) {
        console.log('Block finalized');

      }});



    }
  };

  const handleDec = async () => {

    if (apiBC && (accounts !== null ) && idAccount) {

      //Define deployed contract with metadata + contract address
      const contract = new ContractPromise(apiBC, metadata, process.env.REACT_APP_CONTRACT_ADDRESS as string);
      const injector = await web3FromAddress(accounts[index].address);

      await contract.tx.des({ storageDepositLimit, gasLimit })
      .signAndSend(accounts[index].address,
        { signer: injector?.signer }, result => {
      if (result.status.isFinalized) {
        console.log('Block finalized');

      }});
    }
  };

  return (
    <div>
      <Button onClick={handleConnect}>Connect Wallet</Button>

      {isShown && (
        <Hidden mdDown={hidden}>
          <Box
            sx={{
              display: "flex",
              "& > *": {
                m: 1,
              },
            }}
          >
            <ButtonGroup
              orientation="vertical"
              aria-label="vertical outlined button group"
            >
              {walletOptions}
            </ButtonGroup>
          </Box>
        </Hidden>
      )}

      {hidden && (
        <div>
          {accounts.map((account, id) => {
            return (
              <Button
                onClick={() => chooseAccount(id)}
              >{`${account.meta.name}: ${account.address}`}</Button>
            );
          })}
        </div>
      )}

      {!isShown && !hidden && account !== undefined && (
        <div>
          <h2>Chosen Account: {account}</h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "300%",
              position: "absolute",
              width: "100%",
              height: "100%",
              top: "-15%",
            }}
          >
            Counter DApp
            <div
              style={{
                fontSize: "120%",
                position: "relative",
                top: "10vh",
              }}
            >
              {counter}
            </div>
            <div className="buttons">
              <button
                style={{
                  fontSize: "60%",
                  position: "relative",
                  top: "20vh",
                  marginRight: "5px",
                }}
                onClick={handleInc}
              >
                Increment
              </button>
              <button
                style={{
                  fontSize: "60%",
                  position: "relative",
                  top: "20vh",
                  marginLeft: "5px",
                }}
                onClick={handleDec}
              >
                Decrement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
