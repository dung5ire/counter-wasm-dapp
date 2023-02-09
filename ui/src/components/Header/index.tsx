import { useState, useCallback } from 'react';
import { Button, Typography} from '@mui/material';
import useSubstrateContext from '../../hooks/useSubstrateContext';
import WalletsModal from '../WalletsModal';
import AccountsModal from '../AccountsModal';
import { HeaderContainer } from './styles';

const Header = () => {
  const substrateInfo = useSubstrateContext();

  const [openState, setOpenState] = useState(0);

  const handleConnect = () => {
    setOpenState(1);
  };

  const onCloseWalletsModal = useCallback(() => {
    setOpenState(2);
  }, []);

  const onCloseAccountsModal = useCallback(() => {
    setOpenState(0);
  }, []);

  return (
    <header>
      <HeaderContainer>
        <Typography variant="h5" fontWeight={700}>Counter Dapp</Typography>
        <Button variant="contained" onClick={handleConnect}>
          Connect Wallet
        </Button>
      </HeaderContainer>
      <WalletsModal open={openState === 1} onClose={onCloseWalletsModal} />
      <AccountsModal
        open={openState === 2}
        accounts={substrateInfo?.accounts || []}
        onClose={onCloseAccountsModal}
      />
    </header>
  )
};

export default Header;