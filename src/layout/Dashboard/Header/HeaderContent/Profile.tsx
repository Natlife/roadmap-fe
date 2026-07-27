import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  ButtonBase,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography
} from '@mui/material';
import { Logout, Profile, Setting2 } from 'iconsax-reactjs';

import Avatar from '@/components/extended/Avatar';
import Transitions from '@/components/extended/Transitions';
import StatusChip from '@/components/StatusChip';
import useAuth from '@/hooks/useAuth';

export default function ProfileSection() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const initials = (user?.fullName || user?.name || '?')
    .trim()
    .split(/\s+/)
    .map((w) => w[0] || '')
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Box sx={{ ml: 1 }}>
      <ButtonBase
        ref={anchorRef}
        onClick={() => setOpen((o) => !o)}
        sx={{ p: 0.5, borderRadius: 2, '&:hover': { bgcolor: 'action.hover' } }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 0.5 }}>
          <Avatar size="sm">{initials}</Avatar>
          <Typography variant="subtitle1" sx={{ display: { xs: 'none', sm: 'block' } }}>
            {user?.fullName || user?.name}
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper open={open} anchorEl={anchorRef.current} placement="bottom-end" transition disablePortal sx={{ zIndex: 1200 }}>
        {({ TransitionProps }) => (
          <Transitions type="grow" {...TransitionProps}>
            <Paper sx={{ width: 260, mt: 1, border: '1px solid', borderColor: 'divider', boxShadow: 6 }}>
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <Box>
                  <Stack direction="row" spacing={1.5} alignItems="center" sx={{ p: 2 }}>
                    <Avatar>{initials}</Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="subtitle1" noWrap>
                        {user?.fullName || user?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {user?.email}
                      </Typography>
                    </Box>
                  </Stack>
                  <Box sx={{ px: 2, pb: 1 }}>
                    <StatusChip label={user?.role} />
                  </Box>
                  <Divider />
                  <List sx={{ p: 1 }}>
                    <ListItemButton onClick={() => { setOpen(false); navigate('/settings'); }}>
                      <ListItemIcon><Profile size={18} /></ListItemIcon>
                      <ListItemText primary="My profile" />
                    </ListItemButton>
                    <ListItemButton onClick={() => { setOpen(false); navigate('/settings'); }}>
                      <ListItemIcon><Setting2 size={18} /></ListItemIcon>
                      <ListItemText primary="Settings" />
                    </ListItemButton>
                    <ListItemButton onClick={logout}>
                      <ListItemIcon><Logout size={18} /></ListItemIcon>
                      <ListItemText primary="Logout" />
                    </ListItemButton>
                  </List>
                </Box>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
}
