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

  await queryTransaction(userKeyring, api, metadata, "0xF26A215A059e3aBB80a53A90E13429DA46090D9C", defaultTxOptions);


}

const queryTransaction = async (
  alith,
  api,
  contractFile,
  contractAddress,
  options,
) => {
  console.log("Begin querying smart contract");

  //Define deployed contract with metadata + contract address
  const contract = new ContractPromise(api, contractFile, contractAddress);

  // Query value from contract
  const { result, output } = await contract.query.get(alith.publicKey, options);


  let value = output?.toHuman();
  console.log(value); 

  return value;
};




main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

