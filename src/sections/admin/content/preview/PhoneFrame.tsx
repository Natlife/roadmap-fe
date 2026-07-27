import { Box } from '@mui/material';
import { type ReactNode } from 'react';

// A lightweight device frame; screen content scrolls inside.
export default function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        width: 360,
        maxWidth: '100%',
        mx: 'auto',
        p: 1.2,
        borderRadius: 6,
        bgcolor: '#111318',
        boxShadow: '0 20px 50px -20px rgba(0,0,0,0.55)'
      }}
    >
      <Box sx={{ position: 'relative', borderRadius: 5, overflow: 'hidden', bgcolor: '#F8FAFC', height: 680 }}>
        {/* notch */}
        <Box sx={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', width: 120, height: 22, bgcolor: '#111318', borderRadius: 20, zIndex: 2 }} />
        <Box
          sx={{
            height: '100%',
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
