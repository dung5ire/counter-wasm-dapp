import * as React from "react";



import { getApi } from "../api/config/utils";
import { useSubstrate } from "../api/providers/connectContext";

import Button from '@mui/material/Button';
import {web3FromAddress } from '@polkadot/extension-dapp';
import { Stack } from "@mui/system";
import Hidden from "@mui/material/Hidden";
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';

interface IHomePageProps {}



export default function HomePage(props: IHomePageProps) {
  const { getExtension, accounts } = useSubstrate();

  const [walletState, setWalletState] = React.useState<string>("");
  const [account,setAccount] = React.useState<string | undefined>(undefined);
  const [isShown, setIsShown] = React.useState<boolean>(false);
  const [hidden, setHidden] = React.useState<boolean>(false);
  const [apiBC, setApiBC] = React.useState<any>();

  const handleClickPolkadot =() =>{
    
    setHidden(true);


  }

  const walletOptions = [
    <Button key="polkadot" onClick = {handleClickPolkadot}>PolkadotJs</Button>
  ];

  const callApi = async () => {
    const api = await getApi();

    setApiBC(api);
  };
  


  React.useEffect(() => {
    callApi();
    getExtension();
  }, []);

  const handleConnect = () => {

    setIsShown(current => !current);

  }


  const chooseAccount = (id:any) =>{
    let acc = accounts.find((acc,index) => id ==index);
    console.log(acc?.address);
    setAccount(acc?.address);
    setHidden(false);
    setIsShown(false);
    if (acc?.address) {
      localStorage.setItem("chosen_account",id);
    }
    
  }

  console.log("Account:",account);
  return <div>


    <Button onClick={handleConnect}>
      Connect Wallet
    </Button>

    {isShown && (
    <Hidden mdDown= {hidden}>
      <Box
        sx={{
          display: 'flex',
          '& > *': {
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
        {accounts.map((account, id) => {return <Button onClick= {() =>chooseAccount(id)}>{`${account.meta.name}: ${account.address}`}</Button>})}
      </div>  
    )}

    { !isShown && !hidden && (account !== undefined) && (
      <h2>Chosen Account: {account}</h2>
    
    )
    
    }

  </div>;
}
