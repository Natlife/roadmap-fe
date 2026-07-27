import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = 'Delete',
  loading,
  onConfirm,
  onClose
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }} justifyContent="flex-end">
          <Button color="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={onConfirm} disabled={loading}>
            {loading ? 'Working…' : confirmText}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
