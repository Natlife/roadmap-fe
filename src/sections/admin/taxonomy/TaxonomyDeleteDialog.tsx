import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Typography
} from '@mui/material';

import { useDeleteTaxonomy } from '@/hooks/useTaxonomy';
import { TAXONOMY_LABEL, type TaxonomyItem, type TaxonomyKind } from '@/types';

interface Props {
  open: boolean;
  kind: TaxonomyKind;
  item?: TaxonomyItem | null;
  onClose: () => void;
}

export default function TaxonomyDeleteDialog({ open, kind, item, onClose }: Props) {
  const label = TAXONOMY_LABEL[kind].singular.toLowerCase();
  const del = useDeleteTaxonomy(kind);
  const { enqueueSnackbar } = useSnackbar();
  const [force, setForce] = useState(false);

  const inUse = (item?.usageCount ?? 0) > 0;

  useEffect(() => {
    if (open) setForce(false);
  }, [open]);

  const confirm = () => {
    if (!item) return;
    del.mutate(
      { id: item.id, force: inUse ? force : false },
      {
        onSuccess: () => {
          enqueueSnackbar(`${item.title} deleted`, { variant: 'success' });
          onClose();
        },
        onError: (e) => enqueueSnackbar((e as Error).message || 'Delete failed', { variant: 'error' })
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Delete {label}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            Permanently delete <b>{item?.title}</b>?
          </Typography>
          {inUse && (
            <>
              <Alert severity="warning">
                This {label} is linked to {item?.usageCount} topic{item?.usageCount === 1 ? '' : 's'}. Deleting it will
                remove those links.
              </Alert>
              <FormControlLabel
                control={<Checkbox checked={force} onChange={(e) => setForce(e.target.checked)} />}
                label={`Detach from ${item?.usageCount} topic(s) and delete`}
              />
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button color="secondary" onClick={onClose} disabled={del.isPending}>Cancel</Button>
        <Button color="error" variant="contained" onClick={confirm} disabled={del.isPending || (inUse && !force)}>
          {del.isPending ? 'Deleting…' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
