import { List, Typography, Box } from '@mui/material';

import { useMenu } from '@/contexts/MenuContext';
import NavItem from './NavItem';
import type { NavItemType } from '@/types/menu';

export default function NavGroup({ group }: { group: NavItemType }) {
  const { drawerOpen } = useMenu();

  return (
    <List
      subheader={
        group.title && drawerOpen ? (
          <Box sx={{ pl: 2.5, pt: 1.5, pb: 0.5 }}>
            <Typography variant="overline" color="text.secondary">
              {group.title}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ pt: 1 }} />
        )
      }
      sx={{ py: 0 }}
    >
      {group.children?.map((item) =>
        item.type === 'item' ? <NavItem key={item.id} item={item} level={1} /> : null
      )}
    </List>
  );
}
