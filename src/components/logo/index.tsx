import { Link as RouterLink } from 'react-router-dom';
import { ButtonBase } from '@mui/material';

import LogoMain from './LogoMain';
import LogoIcon from './LogoIcon';
import { APP_DEFAULT_PATH } from '@/config';

interface LogoSectionProps {
  isIcon?: boolean;
  to?: string;
}

export default function LogoSection({ isIcon, to }: LogoSectionProps) {
  return (
    <ButtonBase disableRipple component={RouterLink} to={to ?? APP_DEFAULT_PATH} aria-label="logo">
      {isIcon ? <LogoIcon /> : <LogoMain />}
    </ButtonBase>
  );
}
