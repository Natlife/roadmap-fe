import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Pagination,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { SearchNormal1, TickCircle, CloseCircle, Refresh, MessageQuestion } from 'iconsax-reactjs';
import { useSnackbar } from 'notistack';

import planRequestService, { type PlanRequestItem } from '@/services/planRequestService';

export default function PlanRequestManagement() {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<PlanRequestItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Action Dialog State
  const [selectedTicket, setSelectedTicket] = useState<PlanRequestItem | null>(null);
  const [actionType, setActionType] = useState<'APPROVED' | 'REJECTED' | 'PENDING' | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await planRequestService.getPlanRequests({
        page,
        limit: 10,
        status: statusFilter,
        search: searchQuery
      });
      setRequests(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to fetch plan requests', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, searchQuery, enqueueSnackbar]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const handleOpenAction = (ticket: PlanRequestItem, type: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    setSelectedTicket(ticket);
    setActionType(type);
    setAdminNote(ticket.admin_note || '');
  };

  const handleCloseAction = () => {
    setSelectedTicket(null);
    setActionType(null);
    setAdminNote('');
  };

  const handleConfirmAction = async () => {
    if (!selectedTicket || !actionType) return;
    setSubmitting(true);
    try {
      await planRequestService.updatePlanRequestStatus(selectedTicket.id, {
        status: actionType,
        adminNote
      });
      enqueueSnackbar(
        actionType === 'APPROVED'
          ? 'Ticket APPROVED! Learner account auto-upgraded to PREMIUM.'
          : actionType === 'PENDING'
            ? 'Ticket reset to PENDING status.'
            : 'Ticket REJECTED.',
        { variant: actionType === 'APPROVED' ? 'success' : actionType === 'PENDING' ? 'warning' : 'info' }
      );
      handleCloseAction();
      fetchRequests();
    } catch (err: any) {
      enqueueSnackbar(err?.message || 'Failed to update ticket status', { variant: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Chip label="APPROVED" color="success" size="small" sx={{ fontWeight: 700 }} />;
      case 'REJECTED':
        return <Chip label="REJECTED" color="error" size="small" sx={{ fontWeight: 700 }} />;
      default:
        return <Chip label="PENDING" color="warning" size="small" sx={{ fontWeight: 700 }} />;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Plan Request Tickets
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review and manage learner requests to upgrade to Premium plan
            </Typography>
          </Box>
        </Stack>

        {/* Filter Card */}
        <Card sx={{ p: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
            <Tabs
              value={statusFilter}
              onChange={(_, newValue) => {
                setStatusFilter(newValue);
                setPage(1);
              }}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="ALL" value="ALL" />
              <Tab label="PENDING" value="PENDING" />
              <Tab label="APPROVED" value="APPROVED" />
              <Tab label="REJECTED" value="REJECTED" />
            </Tabs>

            <TextField
              size="small"
              placeholder="Search name, phone, email, content..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchNormal1 size={18} />
                  </InputAdornment>
                )
              }}
              sx={{ minWidth: 280 }}
            />
          </Stack>
        </Card>

        {/* Datagrid Table */}
        <Card>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Learner Info</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Phone Number</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Request Content / Reason</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Submitted At</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} />
                    </TableCell>
                  </TableRow>
                ) : requests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        No plan requests found matching your filter.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  requests.map((row) => (
                    <TableRow key={row.id} hover>
                      <TableCell>#{row.id}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {row.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {row.user_email || 'Guest learner'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.phone}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 300 }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                          {row.content}
                        </Typography>
                        {row.admin_note && (
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                            Admin Note: {row.admin_note}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{getStatusChip(row.status)}</TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(row.created_at).toLocaleString('vi-VN')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {row.status !== 'APPROVED' && (
                            <Tooltip title="Approve Request (Auto-upgrade to PREMIUM)">
                              <IconButton
                                color="success"
                                size="small"
                                onClick={() => handleOpenAction(row, 'APPROVED')}
                              >
                                <TickCircle size={20} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {row.status !== 'PENDING' && (
                            <Tooltip title="Reset Ticket Status to PENDING">
                              <IconButton
                                color="warning"
                                size="small"
                                onClick={() => handleOpenAction(row, 'PENDING')}
                              >
                                <Refresh size={20} />
                              </IconButton>
                            </Tooltip>
                          )}
                          {row.status !== 'REJECTED' && (
                            <Tooltip title="Reject Request">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleOpenAction(row, 'REJECTED')}
                              >
                                <CloseCircle size={20} />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                Showing {requests.length} of {total} items
              </Typography>
              <Pagination count={totalPages} page={page} onChange={(_, p) => setPage(p)} color="primary" />
            </Box>
          )}
        </Card>
      </Stack>

      {/* Action Dialog */}
      <Dialog open={Boolean(selectedTicket)} onClose={handleCloseAction} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Stack direction="row" spacing={1} alignItems="center">
            <MessageQuestion size={24} />
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {actionType === 'APPROVED'
                ? 'Approve Premium Plan Request'
                : actionType === 'PENDING'
                  ? 'Reset Ticket Status to PENDING'
                  : 'Reject Plan Request'}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography variant="body2">
              Learner: <strong>{selectedTicket?.name}</strong> ({selectedTicket?.phone})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Request Content: &quot;{selectedTicket?.content}&quot;
            </Typography>
            {actionType === 'APPROVED' && (
              <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                ✓ Approving this request will automatically upgrade the learner&apos;s account to PREMIUM!
              </Typography>
            )}
            {actionType === 'PENDING' && (
              <Typography variant="body2" color="warning.main" sx={{ fontWeight: 600 }}>
                ↺ Resetting this ticket will mark it as PENDING (In Review).
              </Typography>
            )}

            <TextField
              label="Admin Note (Optional)"
              multiline
              rows={3}
              placeholder="Add feedback or payment confirmation note..."
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAction} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={actionType === 'APPROVED' ? 'success' : actionType === 'PENDING' ? 'warning' : 'error'}
            onClick={handleConfirmAction}
            disabled={submitting}
          >
            {submitting
              ? 'Processing...'
              : actionType === 'APPROVED'
                ? 'Confirm Approval'
                : actionType === 'PENDING'
                  ? 'Set to PENDING'
                  : 'Confirm Rejection'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
