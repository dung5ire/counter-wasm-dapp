import { ContractPromise } from '@polkadot/api-contract';

import { getApi } from '../config/utils';
import metadata from '../metadata/metadata.json';
import { BN, BN_ONE } from '@polkadot/util';
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS as string;

const useCounterContract = async () => {
  const api = await getApi();
  const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
  const PROOFSIZE = new BN(1_000_000);

  const gasLimit = api.registry.createType('WeightV2', {
    refTime: MAX_CALL_WEIGHT,
    proofSize: PROOFSIZE,
  });


  const contract = new ContractPromise(api, metadata, contractAddress);
  return { contract, gasLimit }
};

export default useCounterContract;