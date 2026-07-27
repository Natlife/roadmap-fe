import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
import type { StepBlock } from '@/types';

interface ParsedSlideItem {
  pageIndex: number;
  imageUrl?: string;
  text: string;
  html: string;
}

interface SlideImportDialogProps {
  open: boolean;
  onClose: () => void;
  onImport: (blocks: StepBlock[]) => void;
}

export default function SlideImportDialog({ open, onClose, onImport }: SlideImportDialogProps) {
  const { enqueueSnackbar } = useSnackbar();

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
          `Đã tự động bóc tách thành công CẢ CHỮ & ÁNH cho ${hasImagesCount}/${res.numPages} trang slide từ file PDF!`,
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

    // Sort files by name so slide1.png, slide2.png... stay in order
    files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    setUploadingLocalImages(true);
    try {
      const res = await contentService.uploadImages(files);
      if (res.urls && res.urls.length > 0) {
        setImageUrls(res.urls);
        enqueueSnackbar(`Đã tải lên và lưu ${res.count} file ảnh ghi đè từ máy tính!`, { variant: 'success' });
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
        enqueueSnackbar(`Đã nạp ${res.count} hình ảnh slide từ Google Drive!`, { variant: 'success' });
      } else {
        enqueueSnackbar('Không tìm thấy ảnh nào trong thư mục Google Drive', { variant: 'warning' });
      }
    } catch (err) {
      enqueueSnackbar((err as Error).message || 'Lỗi khi nạp ảnh từ Google Drive', { variant: 'error' });
    } finally {
      setFetchingFolder(false);
    }
  };

  // Build combined pairs (Slide 1: Image 1 + Text 1, Slide 2: Image 2 + Text 2...)
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
      enqueueSnackbar('Chưa có nội dung slide nào để chèn', { variant: 'warning' });
      return;
    }

    const generatedBlocks: StepBlock[] = [];

    combinedSlides.forEach((slide) => {
      // 1. Heading block for Slide title
      generatedBlocks.push({
        ...contentService.makeBlock('HEADING'),
        title: `Slide ${slide.pageIndex}`
      });

      // 2. Image block if available
      if (slide.imageUrl) {
        generatedBlocks.push({
          ...contentService.makeBlock('IMAGE'),
          mediaUrl: slide.imageUrl,
          caption: `Slide ${slide.pageIndex}`
        });
      }

      // 3. Rich text block for slide content
      if (slide.html || slide.text) {
        generatedBlocks.push({
          ...contentService.makeBlock('RICHTEXT'),
          body: slide.html || `<p>${slide.text}</p>`
        });
      }
    });

    onImport(generatedBlocks);
    enqueueSnackbar(`Đã tạo và chèn ${generatedBlocks.length} blocks từ ${combinedSlides.length} slide vào bài học!`, { variant: 'success' });
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
      <DialogTitle>Import Bài Giảng Slide (PDF ➔ Content Blocks)</DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2.5}>
          <Alert severity="info" sx={{ fontSize: '0.85rem' }}>
            Hệ thống sẽ tự động bóc tách chữ từ file PDF slide và kết hợp với ảnh slide (tải từ máy tính hoặc Google Drive) để tạo ra các cặp block <strong>[Tiêu đề ➔ Ảnh ➔ Nội dung]</strong> chuẩn thứ tự 1, 2, 3...
          </Alert>

          <Grid container spacing={2}>
            {/* Step 1: Upload PDF Slide */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper variant="outlined" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                  1. Tải lên File Slide PDF
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  File PDF xuất từ Canva / PowerPoint để trích xuất văn bản từng slide.
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
                  2. Nguồn Ảnh Slide
                </Typography>

                <Tabs value={imageSourceTab} onChange={(_, v) => setImageSourceTab(v)} sx={{ minHeight: 36, mb: 1.5 }}>
                  <Tab label="Tải từ máy tính" sx={{ py: 0.5, fontSize: '0.8rem' }} />
                  <Tab label="Google Drive Folder" sx={{ py: 0.5, fontSize: '0.8rem' }} />
                </Tabs>

                {imageSourceTab === 0 ? (
                  <Stack spacing={1} sx={{ mt: 'auto' }}>
                    <Typography variant="caption" color="text.secondary">
                      Chọn tất cả các file ảnh slide (PNG / JPG) đã xuất trên máy tính (hệ thống tự xếp theo thứ tự tên file).
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

          {/* Preview list of matched slides */}
          {combinedSlides.length > 0 && (
            <Stack spacing={1.5}>
              <Divider />
              <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                Xem trước danh sách bài giảng ({combinedSlides.length} slides):
              </Typography>

              <Stack spacing={1.5} sx={{ maxHeight: 320, overflowY: 'auto', pr: 0.5 }}>
                {combinedSlides.map((slide, idx) => (
                  <Paper
                    key={idx}
                    variant="outlined"
                    sx={{ p: 1.5, display: 'flex', gap: 2, alignItems: 'flex-start', bgcolor: 'background.default' }}
                  >
                    {/* Slide Number */}
                    <Typography variant="caption" fontWeight={800} sx={{ minWidth: 50, pt: 0.5 }}>
                      Slide {slide.pageIndex}
                    </Typography>

                    {/* Image Preview */}
                    {slide.imageUrl ? (
                      <Box
                        component="img"
                        src={slide.imageUrl}
                        alt={`Slide ${slide.pageIndex}`}
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

                    {/* Remove Slide Pair */}
                    <IconButton size="small" color="error" onClick={() => handleRemoveSlide(idx)}>
                      <Trash size={16} />
                    </IconButton>
                  </Paper>
                ))}
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
          Chèn tất cả {combinedSlides.length > 0 ? `${combinedSlides.length} slide` : ''} vào bài học
        </Button>
      </DialogActions>
    </Dialog>
  );
}
