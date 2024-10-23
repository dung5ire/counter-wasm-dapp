import { ContractPromise } from '@polkadot/api-contract';
import { BN, BN_ONE } from '@polkadot/util';
import type { WeightV2 } from '@polkadot/types/interfaces';

import config from '../config';
import { getApi } from '../config/utils';
import metadata from '../metadata/counter.json';
import { MAX_CALL_WEIGHT, PROOF_SIZE } from '../constants';

const useCounterContract: () => Promise<{
  contract: ContractPromise,
  gasLimit: WeightV2,
}> = async () => {
  const { contractAddress } = config;

  const api = await getApi();
  const maxCallWeight = new BN(MAX_CALL_WEIGHT).isub(BN_ONE);
  const proofSize = new BN(PROOF_SIZE);

  const gasLimit = api.registry.createType('WeightV2', {
    refTime: maxCallWeight,
    proofSize,
  }) as WeightV2;

  const contract = new ContractPromise(api, metadata, contractAddress);

  return { contract, gasLimit };
};

export default useCounterContract;