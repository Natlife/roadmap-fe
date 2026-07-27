import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { Trash } from 'iconsax-reactjs';
import { useSnackbar } from 'notistack';
import contentService from '@/services/contentService';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

interface BulkImageDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (urls: string[]) => void;
}

export default function BulkImageDialog({ open, onClose, onImport }: BulkImageDialogProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [tab, setTab] = useState(0);

  // Tab 0: GDrive Folder Link
  const [folderUrl, setFolderUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchedUrls, setFetchedUrls] = useState<string[]>([]);
  const [failedUrls, setFailedUrls] = useState<Set<string>>(new Set());

  // Tab 1: Paste Multiple Links (Textarea)
  const [rawText, setRawText] = useState('');

  const handleFetchFolder = async () => {
    if (!folderUrl.trim()) {
      enqueueSnackbar('Vui lòng nhập đường dẫn thư mục Google Drive', { variant: 'warning' });
      return;
    }
    setLoading(true);
    setFetchedUrls([]);
    setFailedUrls(new Set());
    try {
      const res = await contentService.parseGDriveFolder(folderUrl.trim());
      if (!res.urls || res.urls.length === 0) {
        enqueueSnackbar('Không tìm thấy tệp ảnh nào trong thư mục Google Drive này. Hãy đảm bảo thư mục được bật chia sẻ công khai "Bất kỳ ai có liên kết".', { variant: 'warning' });
      } else {
        setFetchedUrls(res.urls);
        enqueueSnackbar(`Đã tìm thấy ${res.count} hình ảnh!`, { variant: 'success' });
      }
    } catch (err) {
      enqueueSnackbar((err as Error).message || 'Không thể đọc thư mục Google Drive', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSingle = (index: number) => {
    const targetUrl = fetchedUrls[index];
    setFetchedUrls((prev) => prev.filter((_, i) => i !== index));
    if (targetUrl) {
      setFailedUrls((prev) => {
        const next = new Set(prev);
        next.delete(targetUrl);
        return next;
      });
    }
  };

  const handleRemoveAllFailed = () => {
    if (failedUrls.size === 0) return;
    const remaining = fetchedUrls.filter((url) => !failedUrls.has(url));
    const countRemoved = fetchedUrls.length - remaining.length;
    setFetchedUrls(remaining);
    setFailedUrls(new Set());
    enqueueSnackbar(`Đã loại bỏ ${countRemoved} ảnh bị lỗi!`, { variant: 'info' });
  };

  const handleMarkAsFailed = (url: string) => {
    setFailedUrls((prev) => new Set(prev).add(url));
  };

  const handleImportFolderImages = () => {
    if (fetchedUrls.length === 0) return;
    onImport(fetchedUrls);
    handleResetAndClose();
  };

  const handleImportRawText = () => {
    const lines = rawText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    if (lines.length === 0) {
      enqueueSnackbar('Vui lòng nhập ít nhất một đường dẫn ảnh', { variant: 'warning' });
      return;
    }

    const resolved = lines.map((l) => resolveImageUrl(l));
    onImport(resolved);
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setFolderUrl('');
    setFetchedUrls([]);
    setFailedUrls(new Set());
    setRawText('');
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleResetAndClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nhập hình ảnh hàng loạt (Bulk Image Import)</DialogTitle>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
        <Tabs value={tab} onChange={(_, val) => setTab(val)}>
          <Tab label="Thư mục Google Drive" />
          <Tab label="Dán nhiều link ảnh (Dạng danh sách)" />
        </Tabs>
      </Box>

      <DialogContent sx={{ pt: 2.5 }}>
        {/* TAB 0: GOOGLE DRIVE FOLDER */}
        {tab === 0 && (
          <Stack spacing={2}>
            <Alert severity="info" sx={{ fontSize: '0.85rem' }}>
              Dán liên kết Thư mục Google Drive (Chế độ chia sẻ: <strong>Bất kỳ ai có liên kết đều có thể xem</strong>). Hệ thống sẽ tự động quét và nạp danh sách ảnh trong thư mục vào bài học.
            </Alert>

            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <TextField
                fullWidth
                size="small"
                label="Đường dẫn thư mục Google Drive"
                placeholder="https://drive.google.com/drive/folders/1A2B3C..."
                value={folderUrl}
                onChange={(e) => setFolderUrl(e.target.value)}
                disabled={loading}
              />
              <Button
                variant="contained"
                onClick={handleFetchFolder}
                disabled={loading || !folderUrl.trim()}
                sx={{ flexShrink: 0, minWidth: 110, height: 40 }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Nạp ảnh'}
              </Button>
            </Stack>

            {fetchedUrls.length > 0 && (
              <Stack spacing={1.5}>
                <Divider />
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2" color="success.main" fontWeight={700}>
                    Đã quét thấy {fetchedUrls.length} hình ảnh:
                  </Typography>
                  {failedUrls.size > 0 && (
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={handleRemoveAllFailed}
                      startIcon={<Trash size={14} />}
                    >
                      Xóa {failedUrls.size} ảnh lỗi
                    </Button>
                  )}
                </Stack>

                <Grid container spacing={1.5} sx={{ maxHeight: 260, overflowY: 'auto', p: 0.5 }}>
                  {fetchedUrls.map((url, idx) => {
                    const isFailed = failedUrls.has(url);
                    return (
                      <Grid size={{ xs: 4, sm: 3 }} key={`${url}_${idx}`}>
                        <Box
                          sx={{
                            position: 'relative',
                            borderRadius: 1.5,
                            overflow: 'hidden',
                            border: '1.5px solid',
                            borderColor: isFailed ? 'error.main' : 'divider',
                            bgcolor: isFailed ? 'error.lighter' : 'background.paper',
                            boxShadow: 1
                          }}
                        >
                          <Box
                            component="img"
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            onError={() => handleMarkAsFailed(url)}
                            sx={{
                              width: '100%',
                              height: 75,
                              objectFit: 'cover',
                              display: 'block',
                              opacity: isFailed ? 0.4 : 1
                            }}
                          />

                          {/* Top-Right Delete Button */}
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveSingle(idx)}
                            sx={{
                              position: 'absolute',
                              top: 3,
                              right: 3,
                              bgcolor: 'rgba(0, 0, 0, 0.65)',
                              color: '#fff',
                              width: 22,
                              height: 22,
                              '&:hover': { bgcolor: 'error.main' }
                            }}
                            title="Xóa ảnh này"
                          >
                            <Trash size={12} />
                          </IconButton>

                          {/* Error badge if failed */}
                          {isFailed && (
                            <Chip
                              label="Ảnh lỗi"
                              color="error"
                              size="small"
                              sx={{
                                position: 'absolute',
                                bottom: 4,
                                left: 4,
                                height: 18,
                                fontSize: '0.65rem',
                                fontWeight: 700
                              }}
                            />
                          )}
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </Stack>
            )}
          </Stack>
        )}

        {/* TAB 1: PASTE MULTIPLE LINKS */}
        {tab === 1 && (
          <Stack spacing={2}>
            <Alert severity="info" sx={{ fontSize: '0.85rem' }}>
              Dán danh sách các liên kết ảnh hoặc liên kết Google Drive chia sẻ (mỗi đường dẫn 1 dòng).
            </Alert>
            <TextField
              fullWidth
              multiline
              minRows={6}
              maxRows={12}
              label="Danh sách URL ảnh"
              placeholder={'https://drive.google.com/file/d/1AAA...\nhttps://drive.google.com/file/d/2BBB...\nhttps://example.com/image.jpg'}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleResetAndClose} color="inherit">
          Hủy
        </Button>
        {tab === 0 ? (
          <Button
            variant="contained"
            disabled={fetchedUrls.length === 0}
            onClick={handleImportFolderImages}
          >
            Chèn {fetchedUrls.length > 0 ? `${fetchedUrls.length} ảnh` : ''} vào bài học
          </Button>
        ) : (
          <Button variant="contained" onClick={handleImportRawText}>
            Chèn các ảnh đã dán
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
