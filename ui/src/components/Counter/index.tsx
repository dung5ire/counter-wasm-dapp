import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { Typography } from '@mui/material';
import FlexBox from '../Flexbox';
import Loader from '../Loader';
import { CounterContainer, StyledButton } from './styles';
import useSubstrateContext from '../../hooks/useSubstrateContext';
import useCounterContract from '../../hooks/useCounterContract';
import { STORAGE_DEPOSIT_LIMIT } from '../../constants';


const Counter = () => {
  const { address: account } = useSubstrateContext();
  const counterContract = useCounterContract();
  const [currentVal, setCurrentVal] = useState<any>('');
  const [pendingState, setPendingState] = useState(-1);

  const getValue = useCallback(async (address: string) => {
    let _currentValue;

    const { contract, gasLimit } = await counterContract;

    try {
      const { result, output } = await contract.query.get(
        address,
        {
          gasLimit,
          storageDepositLimit: STORAGE_DEPOSIT_LIMIT,
        }
      );

      if (result.isOk) {
        _currentValue = output?.toHuman();
      } else {
        toast.error('Something weng wrong!');
      }
    } catch (error: any) {
      toast.error(error?.message || error);
    } finally {
      return _currentValue;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const { contract, gasLimit } = await counterContract;

        await contract
          .tx
          .inc({
            gasLimit,
            storageDepositLimit: STORAGE_DEPOSIT_LIMIT,
          })
          .signAndSend(account, { signer: window.fire }, async (result) => {
            if (result.status.isFinalized) {
              const res: any = await getValue(account);
              setPendingState(0);
              setCurrentVal(res?.Ok || '');
              toast.success('Successfully increased!');
            }
          });
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
        const { contract, gasLimit } = await counterContract;

        await contract
          .tx
          .des({
            gasLimit,
            storageDepositLimit: STORAGE_DEPOSIT_LIMIT,
          })
          .signAndSend(account, { signer: window.fire }, async (result) => {
            if (result.status.isFinalized) {
              const res: any = await getValue(account);
              setPendingState(0);
              setCurrentVal(res?.Ok || '');
              toast.success('Successfully decreased!');
            }
          });
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