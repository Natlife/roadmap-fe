import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, OutlinedInput, Stack } from '@mui/material';

interface NameDialogProps {
  open: boolean;
  title: string;
  label?: string;
  initial?: string;
  confirmText?: string;
  loading?: boolean;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export default function NameDialog({ open, title, label = 'Title', initial = '', confirmText = 'Create', loading, onSubmit, onClose }: NameDialogProps) {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    if (open) setValue(initial);
  }, [open, initial]);

  const submit = () => {
    const v = value.trim();
    if (v) onSubmit(v);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={1} sx={{ pt: 0.5 }}>
          <InputLabel>{label}</InputLabel>
          <OutlinedInput
            autoFocus
            fullWidth
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant="contained" onClick={submit} disabled={loading || !value.trim()}>{confirmText}</Button>
      </DialogActions>
    </Dialog>
  );
}
