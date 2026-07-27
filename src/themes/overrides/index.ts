import type { Theme, Components } from '@mui/material/styles';

// Component-level overrides that give the app its compact, bordered console feel.
export default function componentsOverride(theme: Theme): Components<Theme> {
  const { palette, customShadows } = theme;
  const border = `1px solid ${palette.divider}`;

  return {
    MuiCssBaseline: {
      styleOverrides: {
        '*': { boxSizing: 'border-box' },
        body: { scrollbarColor: `${palette.grey[600]} transparent` },
        '::-webkit-scrollbar': { width: 8, height: 8 },
        '::-webkit-scrollbar-thumb': { background: palette.grey[palette.mode === 'dark' ? 700 : 300], borderRadius: 8 },
        'a': { textDecoration: 'none', color: palette.primary.main }
      }
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500, textTransform: 'none' },
        sizeSmall: { padding: '4px 12px' },
        contained: { boxShadow: 'none', '&:hover': { boxShadow: 'none' } }
      }
    },
    MuiIconButton: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { rounded: { borderRadius: 10 } } },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 10, border, backgroundImage: 'none', boxShadow: customShadows.card }
      }
    },
    MuiCardHeader: { styleOverrides: { root: { padding: 20 }, title: { fontSize: '1rem', fontWeight: 600 } } },
    MuiCardContent: { styleOverrides: { root: { padding: 20 } } },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 6, fontWeight: 500, height: 24 },
        sizeSmall: { height: 20, fontSize: '0.6875rem' }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          background: palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : palette.grey[50],
          '& .MuiOutlinedInput-notchedOutline': { borderColor: palette.divider },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: palette.grey[palette.mode === 'dark' ? 600 : 400] }
        },
        input: { padding: '10px 12px' }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: palette.divider, padding: '12px 16px' },
        head: { fontWeight: 600, color: palette.text.secondary, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }
      }
    },
    MuiTableRow: { styleOverrides: { root: { '&:last-of-type td': { borderBottom: 'none' } } } },
    MuiTooltip: { styleOverrides: { tooltip: { borderRadius: 6, fontSize: '0.75rem' } } },
    MuiMenu: { styleOverrides: { paper: { borderRadius: 10, border, boxShadow: customShadows.dropdown } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: 12, border, boxShadow: customShadows.dialog, backgroundImage: 'none' } } },
    MuiDrawer: { styleOverrides: { paper: { backgroundImage: 'none', borderColor: palette.divider } } },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            background: palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : palette.primary.lighter,
            color: palette.primary.main,
            '& .MuiListItemIcon-root': { color: palette.primary.main }
          }
        }
      }
    },
    MuiTab: { styleOverrides: { root: { textTransform: 'none', fontWeight: 500, minHeight: 44 } } },
    MuiLinearProgress: { styleOverrides: { root: { borderRadius: 4, height: 6 } } }
  };
}
