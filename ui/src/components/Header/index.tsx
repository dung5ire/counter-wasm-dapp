import { Button, Typography } from '@mui/material';
import useSubstrateContext from '../../hooks/useSubstrateContext';
import { HeaderContainer } from './styles';
import getAddress from '../../utils/getAddress';
import type { ConnectRes } from '../../types/SubstrateContext';

const Header = () => {
  const {
    isConnected,
    address,
    setLoading,
    setErrMsg,
    setIsConnected,
    setAddress,
  } = useSubstrateContext();

  const handleConnect = () => {
    if (typeof window.fire !== 'undefined') {
      setLoading(true);

      window.fire.request({
        method: 'connect'
      })
        .then((res: ConnectRes) => {
          setAddress(res.evmAddress);
          setIsConnected(true);
        })
        .catch((error: any) => {
          if (error instanceof Error) setErrMsg('Something went wrong!')
        })
        .finally(() => setLoading(false));
    } else {
      setErrMsg(
        'Please install 5ire wallet. You can download it here. https://chrome.google.com/webstore/detail/5irechain-wallet/keenhcnmdmjjhincpilijphpiohdppno.');
    }
  };

  const handleDisconnect = () => {
    if (typeof window.fire !== 'undefined') {
      setLoading(true);

      window.fire.request({
        method: 'disconnect'
      })
        .then(() => {
          setAddress('');
          setIsConnected(false);
        })
        .catch((error: any) => {
          if (error instanceof Error) setErrMsg('Something went wrong!')
        })
        .finally(() => setLoading(false));
    } else {
      setErrMsg(
        'Please install 5ire wallet. You can download it here. https://chrome.google.com/webstore/detail/5irechain-wallet/keenhcnmdmjjhincpilijphpiohdppno.');
    }
  };

  return (
    <header>
      <HeaderContainer>
        <Typography variant="h5" fontWeight={700}>Counter Dapp</Typography>
        <Button
          variant="contained"
          sx={{
            ':disabled': {
              color: '#fff',
              background: (theme) => theme.palette.primary.main,
              cursor: 'not-allowed',
            }
          }}
          onClick={isConnected ? handleDisconnect : handleConnect}
        >
          {address ? getAddress(address) : "Connect Wallet"}
        </Button>
      </HeaderContainer>
    </header>
  )
};

export default Header;