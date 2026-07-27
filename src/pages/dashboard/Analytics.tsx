import { Box, Grid, useTheme } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

import Breadcrumbs from '@/components/Breadcrumbs';
import MainCard from '@/components/extended/MainCard';

export default function Analytics() {
  const theme = useTheme();
  return (
    <Box>
      <Breadcrumbs title="Analytics" />
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12 }}>
          <MainCard title="Active users trend">
            <LineChart
              height={340}
              series={[
                { data: [120, 150, 170, 140, 200, 230, 260, 240, 300], label: 'DAU', area: true, color: theme.palette.primary.main }
              ]}
              xAxis={[{ scaleType: 'point', data: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9'] }]}
            />
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
}
