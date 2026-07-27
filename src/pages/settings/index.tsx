import { Box, Grid, MenuItem, Select, Stack, Switch, Tooltip, Typography } from '@mui/material';
import { type ReactNode } from 'react';

import Breadcrumbs from '@/components/Breadcrumbs';
import MainCard from '@/components/extended/MainCard';
import useConfig from '@/hooks/useConfig';
import type { PresetColor } from '@/config';
import { BrandColorHex, BrandColorTone } from '@/constants/themeColors';

const PRESETS: { value: PresetColor; label: string; color: string }[] = [
  { value: BrandColorTone.GREEN, label: 'Emerald Green (#4EB748)', color: BrandColorHex.GREEN },
  { value: BrandColorTone.BLUE, label: 'Royal Blue (#124DA3)', color: BrandColorHex.BLUE },
  { value: BrandColorTone.ORANGE, label: 'Vivid Orange (#F37022)', color: BrandColorHex.ORANGE }
];

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.5 }}>
      <Box>
        <Typography variant="subtitle1">{label}</Typography>
        {hint && (
          <Typography variant="body2" color="text.secondary">
            {hint}
          </Typography>
        )}
      </Box>
      {children}
    </Stack>
  );
}

export default function Settings() {
  const config = useConfig();

  return (
    <Box>
      <Breadcrumbs title="Settings" />
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <MainCard title="Appearance">
            <Row label="Dark mode" hint="Toggle between light and dark themes">
              <Switch checked={config.mode === 'dark'} onChange={config.onToggleMode} />
            </Row>
            <Row label="Accent color" hint="Primary brand color used across the app">
              <Stack direction="row" spacing={1}>
                {PRESETS.map((p) => (
                  <Tooltip key={p.value} title={p.label} arrow placement="top">
                    <Box
                      onClick={() => config.onChangePresetColor(p.value)}
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: p.color,
                        cursor: 'pointer',
                        border: '2px solid',
                        borderColor: config.presetColor === p.value ? 'text.primary' : 'transparent',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': { transform: 'scale(1.15)' }
                      }}
                    />
                  </Tooltip>
                ))}
              </Stack>
            </Row>
            <Row label="Mini sidebar" hint="Collapse the sidebar to icons by default">
              <Switch checked={config.miniDrawer} onChange={(e) => config.onChangeMiniDrawer(e.target.checked)} />
            </Row>
            <Row label="Boxed container" hint="Constrain content width on large screens">
              <Switch checked={config.container} onChange={(e) => config.onChangeContainer(e.target.checked)} />
            </Row>
            <Row label="Language" hint="Interface language">
              <Select
                size="small"
                value={config.i18n}
                onChange={(e) => config.onChangeLocalization(e.target.value as 'en' | 'vi')}
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="en">English</MenuItem>
                <MenuItem value="vi">Tiếng Việt</MenuItem>
              </Select>
            </Row>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
}
