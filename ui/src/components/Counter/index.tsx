import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Typography } from '@mui/material';
import { ContractPromise } from '@polkadot/api-contract';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import FlexBox from '../Flexbox';
import Loader from '../Loader';
import { getApi } from '../../config/utils';
import metadata from '../../metadata/metadata.json';
import { CounterContainer, StyledButton } from './styles';
import { BN, BN_ONE } from '@polkadot/util';
import type { WeightV2 } from '@polkadot/types/interfaces';

const contractAddress = '5FT1aERN9MhV7iVxb81MGzCvxWjC2XzjZz4RTaucWquBwDky';


// const MAX_CALL_WEIGHT = 3951114240;
// const PROOFSIZE = 125952;
const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000);
const storageDepositLimit = null;

interface CounterProps {
  account?: InjectedAccountWithMeta | null
}

const Counter = ({ account }: CounterProps) => {
  const [currentVal, setCurrentVal] = useState<any>('');
  const [pendingState, setPendingState] = useState(-1);

  const getValue = useCallback(async (address: string) => {
    let _currentValue;
    try {
      const api = await getApi();

      const gasLimit = api.registry.createType('WeightV2', {
        refTime: MAX_CALL_WEIGHT,
        proofSize: PROOFSIZE,
      }) as WeightV2;
      //const gasLimit = api.registry.createType('WeightV2', { refTime: BigInt(100000 * 1000000), proofSize: BigInt(100000) }) as WeightV2;

      const contract = new ContractPromise(api, metadata, contractAddress);
      const { result, output } = await contract.query.get(
        address,
        {
          gasLimit,
          storageDepositLimit,
        }
      );

      console.log("Here:", result.isErr);

      if (result.isOk) {
        console.log("Ok");
        _currentValue = output?.toHuman();
      } else {
        toast.error('Something weng wrong!');
      }
    } catch (error: any) {
      toast.error(error?.message || error);
    } finally {
      return _currentValue;
    }
  }, []);

  useEffect(() => {
    let isApiSubscribed = true;
    if (account) {
      setPendingState(3);
      getValue(account.address).then((res: any) => {
        if (isApiSubscribed) {
          setPendingState(0);
          setCurrentVal(res?.Ok || '');
        }
      });
    }
    return () => {
      isApiSubscribed = false;
    };
  }, [account, getValue]);

  const onIncrease = async () => {
    if (account) {
      setPendingState(1);
      try {
        const api = await getApi();

        const gasLimit = api.registry.createType('WeightV2', {
          refTime: MAX_CALL_WEIGHT,
          proofSize: PROOFSIZE,
          value: 0
        }) as WeightV2;
        const contract = new ContractPromise(api, metadata, contractAddress);
        const injector = await web3FromAddress(account.address);
        await contract
          .tx
          .inc({ storageDepositLimit, gasLimit })
          .signAndSend(account.address, { signer: injector?.signer }, async (result) => {
            if (result.status.isFinalized) {
              const res: any = await getValue(account.address);
              setPendingState(0);
              setCurrentVal(res?.Ok || '');
            }
          }
          );
      } catch (error: any) {
        setPendingState(0);
        toast.error(error?.message || error);
      }
    }
  };

  const onDecrease = async () => {
    if (account) {
      setPendingState(2);
      try {
        const api = await getApi();
        const contract = new ContractPromise(api, metadata, contractAddress);
        const injector = await web3FromAddress(account.address);
        const gasLimit = api.registry.createType('WeightV2', {
          refTime: MAX_CALL_WEIGHT,
          proofSize: PROOFSIZE,
          value: 0
        }) as WeightV2;
        await contract
          .tx
          .des({ storageDepositLimit, gasLimit })
          .signAndSend(account.address, { signer: injector?.signer }, async (result) => {
            if (result.status.isFinalized) {
              const res: any = await getValue(account.address);
              setPendingState(0);
              setCurrentVal(res?.Ok || '');
            }
          }
          );
      } catch (error: any) {
        setPendingState(0);
        toast.error(error?.message || error);
      }
    }
  };

  return (
    <CounterContainer>
      <Typography variant='h4' fontWeight={700} mt={20} mb={6}>
        Counter:&nbsp;
        {pendingState === -1
          ? '?' :
          pendingState === 3
            ? <Loader color='gray' />
            : currentVal
        }
      </Typography>
      <FlexBox>
        <StyledButton
          variant='contained'
          sx={{ marginRight: 4 }}
          disabled={pendingState === 1 || pendingState === 2}
          onClick={onDecrease}
        >
          -
          {pendingState === 2 && <Loader />}
        </StyledButton>
        <StyledButton
          variant='contained'
          disabled={pendingState === 1 || pendingState === 2}
          onClick={onIncrease}
        >
          +
          {pendingState === 1 && <Loader />}
        </StyledButton>
      </FlexBox>
    </CounterContainer>
  )
}

export default Counter