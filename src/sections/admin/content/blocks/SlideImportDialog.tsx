import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@mui/material';
import { DocumentUpload, FolderAdd, Trash } from 'iconsax-reactjs';
import { useSnackbar } from 'notistack';
import contentService from '@/services/contentService';
import { resolveImageUrl } from '@/utils/resolveImageUrl';

export interface ParsedSlideItem {
  pageIndex: number;
  imageUrl?: string;
  text: string;
  html: string;
}

export interface ImportOptions {
  useFirstSlideAsIntro?: boolean;
}

interface SlideImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (slides: ParsedSlideItem[], options?: ImportOptions) => void;
  itemType?: 'step' | 'block';
}

export default function SlideImportDialog({ open, onClose, onImport, itemType = 'step' }: SlideImportDialogProps) {
  const { enqueueSnackbar } = useSnackbar();

  const isBlockMode = itemType === 'block';
  const labelPrefix = isBlockMode ? 'Block' : 'Step';

  const [useFirstSlideAsIntro, setUseFirstSlideAsIntro] = useState(true);


  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [folderUrl, setFolderUrl] = useState('');
  const [parsingPdf, setParsingPdf] = useState(false);
  const [fetchingFolder, setFetchingFolder] = useState(false);
  const [uploadingLocalImages, setUploadingLocalImages] = useState(false);

  const [imageSourceTab, setImageSourceTab] = useState(0); // 0: Local files, 1: GDrive folder

  const [slidesText, setSlidesText] = useState<
    { pageIndex: number; title: string; text: string; html: string; imageUrl?: string }[]
  >([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Handle PDF upload
  const handlePdfChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      enqueueSnackbar('Vui lòng chọn tệp định dạng PDF bài giảng slide', { variant: 'warning' });
      return;
    }

    setPdfFile(file);
    setParsingPdf(true);
    try {
      const res = await contentService.parsePdfSlides(file);
      setSlidesText(res.slides);
      const hasImagesCount = res.slides.filter((s) => Boolean(s.imageUrl)).length;
      if (hasImagesCount > 0) {
        enqueueSnackbar(
          `Đã tự động bóc tách thành công CẢ CHỮ & ẢNH cho ${hasImagesCount}/${res.numPages} trang slide từ file PDF!`,
          { variant: 'success' }
        );
      } else {
        enqueueSnackbar(`Đã bóc tách thành công ${res.numPages} trang slide từ file PDF!`, { variant: 'success' });
      }
    } catch (err) {
      enqueueSnackbar((err as Error).message || 'Không thể đọc file PDF', { variant: 'error' });
      setPdfFile(null);
    } finally {
      setParsingPdf(false);
    }
  };

  // Handle local image files upload
  const handleLocalImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Sort files by name so step1/block1 stay in order
    files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    setUploadingLocalImages(true);
    try {
      const res = await contentService.uploadImages(files);
      if (res.urls && res.urls.length > 0) {
        setImageUrls(res.urls);
        enqueueSnackbar(`Đã tải lên và lưu ${res.count} file ảnh tương ứng từng ${labelPrefix} từ máy tính!`, { variant: 'success' });
      }
    } catch (err) {
      enqueueSnackbar((err as Error).message || 'Không thể tải ảnh lên', { variant: 'error' });
    } finally {
      setUploadingLocalImages(false);
    }
  };

  // Handle GDrive folder fetch
  const handleFetchFolder = async () => {
    if (!folderUrl.trim()) return;
    setFetchingFolder(true);
    try {
      const res = await contentService.parseGDriveFolder(folderUrl.trim());
      if (res.urls && res.urls.length > 0) {
        setImageUrls(res.urls);
        enqueueSnackbar(`Đã nạp ${res.count} hình ảnh slide tương ứng từng ${labelPrefix} từ Google Drive!`, { variant: 'success' });
      } else {
        enqueueSnackbar('Không tìm thấy ảnh nào trong thư mục Google Drive', { variant: 'warning' });
      }
    } catch (err) {
      enqueueSnackbar((err as Error).message || 'Lỗi khi nạp ảnh từ Google Drive', { variant: 'error' });
    } finally {
      setFetchingFolder(false);
    }
  };

  // Build combined pairs (Step 1/Block 1: Image 1 + Text 1...)
  const totalSlidesCount = Math.max(slidesText.length, imageUrls.length);

  const combinedSlides: ParsedSlideItem[] = Array.from({ length: totalSlidesCount }).map((_, i) => {
    const slideInfo = slidesText[i];
    const overrideImgUrl = imageUrls[i];
    const finalImgUrl = overrideImgUrl || slideInfo?.imageUrl;
    return {
      pageIndex: slideInfo?.pageIndex || i + 1,
      imageUrl: finalImgUrl ? resolveImageUrl(finalImgUrl) : undefined,
      text: slideInfo?.text || '',
      html: slideInfo?.html || ''
    };
  });

  const handleRemoveSlide = (idx: number) => {
    setSlidesText((prev) => prev.filter((_, i) => i !== idx));
    setImageUrls((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleImport = () => {
    if (combinedSlides.length === 0) {
      enqueueSnackbar(`Chưa có nội dung nào để tạo ${labelPrefix}`, { variant: 'warning' });
      return;
    }

    onImport(combinedSlides, { useFirstSlideAsIntro: !isBlockMode && useFirstSlideAsIntro });
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setPdfFile(null);
    setFolderUrl('');
    setSlidesText([]);
    setImageUrls([]);
    setParsingPdf(false);
    setFetchingFolder(false);
    setUploadingLocalImages(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleResetAndClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isBlockMode
          ? 'Import Slide PDF ➔ Tự Động Tạo Các Block (Content Blocks)'
          : 'Import Slide PDF ➔ Tự Động Tạo Các Bước (Steps)'}
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2.5}>
          <Alert severity="info" sx={{ fontSize: '0.85rem' }}>
            {isBlockMode
              ? 'Hệ thống sẽ tự động bóc tách từng trang slide từ PDF để tạo thành các Block (Block 1, Block 2, Block 3...) chèn trực tiếp vào Step này.'
              : 'Hệ thống sẽ tự động bóc tách từng trang slide từ PDF để tạo thành từng Bước (Step) chuẩn thứ tự. Ảnh và văn bản của từng trang slide sẽ nằm trọn vẹn trong Step đó.'}
          </Alert>

          {!isBlockMode && combinedSlides.length > 0 && (
            <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'primary.lighter', borderColor: 'primary.light' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useFirstSlideAsIntro}
                    onChange={(e) => setUseFirstSlideAsIntro(e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" fontWeight={700} color="primary.darker">
                    📌 Dùng Slide 1 làm Nội dung Tổng quan / Giới thiệu Bài học (Mô tả), bắt đầu tạo các Bước (Steps) từ Slide 2 trở đi
                  </Typography>
                }
              />
            </Paper>
          )}

          <Grid container spacing={2}>
            {/* Step 1: Upload PDF Slide */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                  1. Tải lên File Slide PDF
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  File PDF xuất từ Canva / PowerPoint để trích xuất văn bản & ảnh cho từng {labelPrefix}.
                </Typography>

                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<DocumentUpload size={18} />}
                  disabled={parsingPdf}
                  sx={{ mt: 'auto', alignSelf: 'flex-start' }}
                >
                  {parsingPdf ? 'Đang đọc PDF...' : pdfFile ? pdfFile.name : 'Chọn file PDF Slide'}
                  <input type="file" accept="application/pdf" hidden onChange={handlePdfChange} />
                </Button>
                {parsingPdf && <CircularProgress size={20} sx={{ mt: 1 }} />}
              </Paper>
            </Grid>

            {/* Step 2: Slide Images Source */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                  2. Nguồn Ảnh Cho Các {labelPrefix}
                </Typography>

                <Tabs value={imageSourceTab} onChange={(_, v) => setImageSourceTab(v)} sx={{ minHeight: 36, mb: 1.5 }}>
                  <Tab label="Tải từ máy tính" sx={{ py: 0.5, fontSize: '0.8rem' }} />
                  <Tab label="Google Drive Folder" sx={{ py: 0.5, fontSize: '0.8rem' }} />
                </Tabs>

                {imageSourceTab === 0 ? (
                  <Stack spacing={1} sx={{ mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary">
                      Chọn tất cả các file ảnh slide (PNG / JPG) đã xuất trên máy tính (hệ thống tự xếp theo thứ tự tên file vào từng {labelPrefix}).
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      color="primary"
                      startIcon={<FolderAdd size={18} />}
                      disabled={uploadingLocalImages}
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      {uploadingLocalImages ? 'Đang tải lên...' : 'Chọn nhiều file ảnh từ máy'}
                      <input type="file" accept="image/*" multiple hidden onChange={handleLocalImagesChange} />
                    </Button>
                    {uploadingLocalImages && <CircularProgress size={20} />}
                  </Stack>
                ) : (
                  <Stack spacing={1} sx={{ mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary">
                      Dán link folder chứa ảnh slide (chia sẻ công khai).
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="https://drive.google.com/drive/folders/..."
                        value={folderUrl}
                        onChange={(e) => setFolderUrl(e.target.value)}
                        disabled={fetchingFolder}
                      />
                      <Button variant="contained" onClick={handleFetchFolder} disabled={fetchingFolder || !folderUrl.trim()}>
                        {fetchingFolder ? <CircularProgress size={18} color="inherit" /> : 'Nạp'}
                      </Button>
                    </Stack>
                  </Stack>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Preview list of matched items */}
          {combinedSlides.length > 0 && (
            <Stack spacing={1.5}>
              <Divider />
              <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                Xem trước danh sách sẽ tạo ({combinedSlides.length} {labelPrefix.toLowerCase()}s):
              </Typography>

              <Stack spacing={1.5} sx={{ maxHeight: 320, overflowY: 'auto', pr: 0.5 }}>
                {combinedSlides.map((slide, idx) => {
                  const isIntroSlide = !isBlockMode && useFirstSlideAsIntro && idx === 0;
                  const stepNumber = !isBlockMode && useFirstSlideAsIntro ? idx : idx + 1;

                  return (
                    <Paper
                      key={idx}
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        display: 'flex',
                        gap: 2,
                        alignItems: 'flex-start',
                        bgcolor: isIntroSlide ? 'info.lighter' : 'background.default',
                        borderColor: isIntroSlide ? 'info.light' : 'divider'
                      }}
                    >
                      {/* Prefix Label */}
                      <Box sx={{ minWidth: 95, pt: 0.5 }}>
                        {isIntroSlide ? (
                          <Chip label="📌 Intro tổng quan" color="info" size="small" sx={{ fontWeight: 800, fontSize: '0.72rem' }} />
                        ) : (
                          <Typography variant="caption" fontWeight={800} color="text.primary">
                            {labelPrefix} {stepNumber}
                          </Typography>
                        )}
                      </Box>

                      {/* Image Preview */}
                      {slide.imageUrl ? (
                        <Box
                          component="img"
                          src={slide.imageUrl}
                          alt={`${labelPrefix} ${slide.pageIndex}`}
                          sx={{ width: 110, height: 65, objectFit: 'cover', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 110,
                            height: 65,
                            borderRadius: 1,
                            bgcolor: 'action.hover',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Chưa có ảnh
                          </Typography>
                        </Box>
                      )}

                      {/* Text Preview */}
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', maxLines: 3 }} color="text.primary">
                          {slide.text ? slide.text.slice(0, 180) + (slide.text.length > 180 ? '...' : '') : '(Chưa có chữ)'}
                        </Typography>
                      </Box>

                      {/* Remove Item */}
                      <IconButton size="small" color="error" onClick={() => handleRemoveSlide(idx)}>
                        <Trash size={16} />
                      </IconButton>
                    </Paper>
                  );
                })}
              </Stack>
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleResetAndClose} color="inherit">
          Hủy
        </Button>
        <Button
          variant="contained"
          disabled={combinedSlides.length === 0}
          onClick={handleImport}
        >
          {isBlockMode
            ? `Chèn tất cả ${combinedSlides.length > 0 ? `${combinedSlides.length} blocks` : ''} vào Step`
            : `Tạo tất cả ${combinedSlides.length > 0 ? `${combinedSlides.length} bước (Steps)` : ''} vào bài học`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
