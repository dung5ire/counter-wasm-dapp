import { ContractPromise } from '@polkadot/api-contract';

import { getApi } from '../config/utils';
import metadata from '../metadata/metadata.json';

const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS as string;

const useCounterContract = async () => {
  const api = await getApi();
  const contract = new ContractPromise(api, metadata, contractAddress);
  return { contract }
};

export default useCounterContract;