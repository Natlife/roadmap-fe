import { useState } from 'react';
import {
  Box,
  IconButton,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography
} from '@mui/material';
import { Edit2, RefreshCircle, Trash } from 'iconsax-reactjs';

import Avatar from '@/components/extended/Avatar';
import StatusChip from '@/components/StatusChip';
import EmptyState from '@/components/EmptyState';
import type { User, UserSortField } from '@/types';

interface UsersTableProps {
  data: User[];
  total: number;
  loading?: boolean;
  page: number; // zero-based
  pageSize: number;
  sortBy: UserSortField;
  sortOrder: 'asc' | 'desc';
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onSortChange: (field: UserSortField) => void;
  onEdit: (user: User) => void;
  onToggleActive: (user: User) => void;
}

const COLUMNS: { id: UserSortField | 'progress' | 'actions'; label: string; sortable: boolean; width?: string; align?: 'right' | 'left' }[] = [
  { id: 'code', label: 'User Code', sortable: true, width: '13%' },
  { id: 'fullName', label: 'Learner', sortable: true, width: '22%' },
  { id: 'email', label: 'Email', sortable: true, width: '22%' },
  { id: 'role', label: 'Role', sortable: true, width: '10%' },
  { id: 'plan', label: 'Plan', sortable: true, width: '10%' },
  { id: 'active', label: 'Status', sortable: true, width: '9%' },
  { id: 'progress', label: 'Progress', sortable: false, width: '7%' },
  { id: 'actions', label: '', sortable: false, align: 'right', width: '7%' }
];

export default function UsersTable({
  data,
  total,
  loading,
  page,
  pageSize,
  sortBy,
  sortOrder,
  onPageChange,
  onPageSizeChange,
  onSortChange,
  onEdit,
  onToggleActive
}: UsersTableProps) {
  const initials = (u: User) =>
    (u.fullName || u.email || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
        <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sortDirection={sortBy === col.id ? sortOrder : false}
                  sx={{ py: 1.25, px: 1.5, width: col.width }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortBy === col.id}
                      direction={sortBy === col.id ? sortOrder : 'asc'}
                      onClick={() => onSortChange(col.id as UserSortField)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading &&
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  {COLUMNS.map((c) => (
                    <TableCell key={c.id} sx={{ py: 1.25, px: 1.5 }}><Skeleton height={28} /></TableCell>
                  ))}
                </TableRow>
              ))}
            {!loading &&
              data.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell sx={{ py: 1.25, px: 1.5, overflow: 'hidden' }}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontFamily: 'Roboto Mono, monospace',
                        fontWeight: 700,
                        bgcolor: 'action.hover',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: 'divider',
                        display: 'inline-block'
                      }}
                    >
                      {u.code || `USR-${String(u.id).padStart(5, '0')}`}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 1.25, px: 1.5, overflow: 'hidden' }}>
                    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ opacity: u.active ? 1 : 0.55, minWidth: 0 }}>
                      <Avatar size="sm" sx={{ flexShrink: 0 }}>{initials(u)}</Avatar>
                      <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
                        <Tooltip title={u.fullName}>
                          <Typography variant="subtitle1" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {u.fullName}
                          </Typography>
                        </Tooltip>
                        <Typography variant="caption" color="primary.main" fontWeight={600} noWrap display="block">
                          @{u.username} • {u.streakDays ?? 0}d streak
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ py: 1.25, px: 1.5, overflow: 'hidden' }}>
                    <Tooltip title={u.email}>
                      <Typography
                        variant="body2"
                        sx={{
                          fontFamily: 'Roboto Mono, monospace',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          display: 'block'
                        }}
                      >
                        {u.email}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell sx={{ py: 1.25, px: 1.5 }}><StatusChip label={u.role} /></TableCell>
                  <TableCell sx={{ py: 1.25, px: 1.5 }}><StatusChip label={u.plan} /></TableCell>
                  <TableCell sx={{ py: 1.25, px: 1.5 }}><StatusChip label={u.active ? 'ACTIVE' : 'INACTIVE'} /></TableCell>
                  <TableCell sx={{ py: 1.25, px: 1.5 }}><Typography variant="body2">{u.completedStepsCount ?? 0} steps</Typography></TableCell>
                  <TableCell align="right" sx={{ py: 1.25, px: 1, whiteSpace: 'nowrap' }}>
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Tooltip title="Edit">
                        <IconButton size="small" color="secondary" aria-label={`Edit ${u.fullName}`} onClick={() => onEdit(u)}>
                          <Edit2 size={16} />
                        </IconButton>
                      </Tooltip>
                      {u.active ? (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" aria-label={`Delete ${u.fullName}`} onClick={() => onToggleActive(u)}>
                            <Trash size={16} />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="Reactivate user">
                          <IconButton size="small" color="success" aria-label={`Reactivate ${u.fullName}`} onClick={() => onToggleActive(u)}>
                            <RefreshCircle size={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {!loading && !data.length && <EmptyState title="No users found" description="Try adjusting your search or filters, or create a new user." />}

      <TablePagination
        component="div"
        count={total}
        page={page}
        onPageChange={(_e, p) => onPageChange(p)}
        rowsPerPage={pageSize}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        rowsPerPageOptions={[10, 20, 50, 100]}
      />
    </Box>
  );
}
