import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Typography } from '@mui/material';
import { ContractPromise } from '@polkadot/api-contract';
import { web3FromAddress } from '@polkadot/extension-dapp';
import FlexBox from '../Flexbox';
import Loader from '../Loader';
import { getApi } from '../../config/utils';
import metadata from '../../metadata/metadata.json';
import { CounterContainer, StyledButton } from './styles';
import { stringToHex, BN, BN_ONE } from '@polkadot/util';
import type { WeightV2 } from '@polkadot/types/interfaces';
import useSubstrateContext from '../../hooks/useSubstrateContext';

const contractAddress = '5Gp8BNeqtbnawXrjPqqQmdKqn76hTLvaxvbboYJ1aj1gesT4';

// const MAX_CALL_WEIGHT = new BN(3951114240);
// const PROOFSIZE = new BN(125952);
const MAX_CALL_WEIGHT = new BN(500_000_000_000).isub(BN_ONE);
const PROOFSIZE = new BN(1_000_000);
const storageDepositLimit = null;

const Counter = () => {
  const { address: account } = useSubstrateContext();
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
      getValue(account).then((res: any) => {
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

        const signPayload = window?.fire?.signPayload;
        console.log(signPayload)

        if (!!signPayload) {
          console.log(222)
          const { signature } = await signPayload({
            address: account,
            data: stringToHex('message to sign'),
            type: 'bytes'
          });

          await contract
            .tx
            .inc({ storageDepositLimit, gasLimit })
            .signAndSend(account, { signer: signature }, async (result) => {
              console.log(result)
              if (result.status.isFinalized) {
                const res: any = await getValue(account);
                setPendingState(0);
                setCurrentVal(res?.Ok || '');
              }
            }
            );
        }
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
        const injector = await web3FromAddress(account);
        const gasLimit = api.registry.createType('WeightV2', {
          refTime: MAX_CALL_WEIGHT,
          proofSize: PROOFSIZE,
          value: 0
        }) as WeightV2;
        await contract
          .tx
          .des({ storageDepositLimit, gasLimit })
          .signAndSend(account, { signer: injector?.signer }, async (result) => {
            if (result.status.isFinalized) {
              const res: any = await getValue(account);
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