import { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@mui/material';
import { Add, Edit2, SearchNormal1, Trash } from 'iconsax-reactjs';

import MainCard from '@/components/extended/MainCard';
import StatusChip from '@/components/StatusChip';
import EmptyState from '@/components/EmptyState';
import useDebounce from '@/hooks/useDebounce';
import { useTaxonomyList } from '@/hooks/useTaxonomy';
import TaxonomyFormDialog from './TaxonomyFormDialog';
import TaxonomyDeleteDialog from './TaxonomyDeleteDialog';
import { TAXONOMY_LABEL, type TaxonomyItem, type TaxonomyKind, type TaxonomyListParams } from '@/types';

export default function TaxonomyPanel({ kind }: { kind: TaxonomyKind }) {
  const label = TAXONOMY_LABEL[kind];
  const [searchInput, setSearchInput] = useState('');
  const search = useDebounce(searchInput, 300);
  const [status, setStatus] = useState<TaxonomyListParams['status']>('all');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TaxonomyItem | null>(null);
  const [deleting, setDeleting] = useState<TaxonomyItem | null>(null);

  const { data, isLoading, isFetching } = useTaxonomyList(kind, { search: search.trim() || undefined, status });
  const rows = data ?? [];

  return (
    <MainCard
      title={
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h5">{label.plural}</Typography>
          <Typography variant="body2" color="text.secondary">
            {rows.length} item{rows.length === 1 ? '' : 's'}
          </Typography>
        </Stack>
      }
      secondary={
        <Button variant="contained" startIcon={<Add size={18} />} onClick={() => { setEditing(null); setFormOpen(true); }}>
          New {label.singular.toLowerCase()}
        </Button>
      }
      contentSX={{ p: 0 }}
    >
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ p: 2.5 }} justifyContent="space-between">
        <OutlinedInput
          size="small"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder={`Search ${label.plural.toLowerCase()}…`}
          startAdornment={<InputAdornment position="start"><SearchNormal1 size={16} /></InputAdornment>}
          sx={{ maxWidth: { sm: 320 }, width: '100%' }}
        />
        <Select size="small" value={status} onChange={(e) => setStatus(e.target.value as TaxonomyListParams['status'])} sx={{ minWidth: 140 }}>
          <MenuItem value="all">All statuses</MenuItem>
          <MenuItem value="active">Active</MenuItem>
          <MenuItem value="inactive">Inactive</MenuItem>
        </Select>
      </Stack>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Topics</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {(isLoading || isFetching) &&
              rows.length === 0 &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {Array.from({ length: 5 }).map((_c, ci) => (
                    <TableCell key={ci}><Skeleton height={26} /></TableCell>
                  ))}
                </TableRow>
              ))}
            {rows.map((it) => (
              <TableRow key={it.id} hover sx={{ opacity: it.status === 1 ? 1 : 0.55 }}>
                <TableCell><Typography variant="subtitle1">{it.title}</Typography></TableCell>
                <TableCell sx={{ maxWidth: 360 }}>
                  <Typography variant="body2" color="text.secondary" noWrap>{it.description || '—'}</Typography>
                </TableCell>
                <TableCell align="center"><Typography variant="body2">{it.usageCount}</Typography></TableCell>
                <TableCell><StatusChip label={it.status === 1 ? 'ACTIVE' : 'INACTIVE'} /></TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.25} justifyContent="flex-end">
                    <Tooltip title="Edit">
                      <IconButton size="small" color="secondary" aria-label={`Edit ${it.title}`} onClick={() => { setEditing(it); setFormOpen(true); }}>
                        <Edit2 size={16} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" aria-label={`Delete ${it.title}`} onClick={() => setDeleting(it)}>
                        <Trash size={16} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!isLoading && !rows.length && (
        <EmptyState
          title={`No ${label.plural.toLowerCase()} found`}
          description={`Create your first ${label.singular.toLowerCase()} to organize topics.`}
        />
      )}

      <TaxonomyFormDialog open={formOpen} kind={kind} item={editing} onClose={() => setFormOpen(false)} />
      <TaxonomyDeleteDialog open={Boolean(deleting)} kind={kind} item={deleting} onClose={() => setDeleting(null)} />
    </MainCard>
  );
}
