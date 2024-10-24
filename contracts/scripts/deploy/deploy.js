const { CodePromise, ContractPromise } = require('@polkadot/api-contract');
const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const fs = require("fs");
const metadata = require('../../res/counter.json');


require('dotenv').config();


const main = async () => {


  //Get wasm 

  let wasm = fs.readFileSync("../../res/counter.wasm");


  // API creation for connection to the chain
  const wsProvider = new WsProvider(process.env.WSS_PROVIDER);
  const api = await ApiPromise.create({ provider: wsProvider });

  console.log("Connect with 5ire Provider");

  const keyring = new Keyring({ type: "ethereum" });
  const userKeyring = keyring.addFromMnemonic(process.env.PRIVATE_KEY);
  const code = new CodePromise(api, metadata, wasm);

  // maximum gas to be consumed for the instantiation. if limit is too small the instantiation will fail.

  // a limit to how much Balance to be used to pay for the storage created by the instantiation
  // if null is passed, unlimited balance can be used
  const storageDepositLimit = null

  const defaultTxOptions = {
    gasLimit: api.registry.createType("WeightV2", {
      refTime: 5908108255,
      proofSize: BigInt(131072),
    }),
    storageDepositLimit,
  };


  const initValue = 100;

  // Initilize contract 
  const tx = code.tx.new(defaultTxOptions, initValue)

  // Sign transaction to deploy contract

  let contractAddress; // variable for storing the address of the deployed contract 

  contractAddress = await (new Promise(async (resolve, reject) => {
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
  console.log("Contract Address:", address);

}




main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
