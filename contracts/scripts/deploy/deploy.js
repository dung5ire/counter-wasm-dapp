const { CodePromise, ContractPromise } = require('@polkadot/api-contract');
const { ApiPromise, WsProvider, Keyring} = require('@polkadot/api');
const fs = require("fs");
const metadata =require('../../res/metadata.json');


require('dotenv').config();


const main = async() => {

    
    //Get wasm 

    let wasm = fs.readFileSync("../../res/counter.wasm");

    
    // API creation for connection to the chain
    const wsProvider = new WsProvider(process.env.WSS_PROVIDER);
    const api = await ApiPromise.create({ provider: wsProvider });

    console.log("Connect with 5ire Provider");

    const keyring = new Keyring({ type: "ed25519" });
    const userKeyring = keyring.addFromMnemonic(process.env.MNEMONIC_PHRASE);
    const code = new CodePromise(api, metadata, wasm);

    // maximum gas to be consumed for the instantiation. if limit is too small the instantiation will fail.
    const gasLimit = 100000n * 1000000n
    // a limit to how much Balance to be used to pay for the storage created by the instantiation
    // if null is passed, unlimited balance can be used
    const storageDepositLimit = null


    const initValue = 0;

    // Initilize contract 
    const tx = code.tx.new({ gasLimit, storageDepositLimit }, initValue)

    // Sign transaction to deploy contract

    let contractAddress; // variable for storing the address of the deployed contract 

    contractAddress = await (new Promise (async (resolve, reject) => {
        try {
            await tx.signAndSend(userKeyring, ({ contract, status }) => {
                

                if (status.isFinalized) {
                    // return contract address
                    
                    address = contract.address.toString();
                    
                    resolve(address);
                    
                    
                }
                });           
        } catch (error) {
            reject(error)
        }
    
    }));
    console.log("Contract Address:",address);
 
}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
