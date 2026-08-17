import { Box, Container, Paper, Typography, Stack, Grid, Button, Card, CardContent, Chip } from '@mui/material';
import { Book, ShieldSecurity, DirectNotification, Code, DocumentText } from 'iconsax-reactjs';
import { useNavigate } from 'react-router-dom';

import useAuth from '@/hooks/useAuth';
import { APP_PACKAGE_ID, SUPPORT_EMAIL } from '@/config';

export default function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ py: 1 }}>
      <Stack spacing={3}>
        {/* Welcome Banner */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            color: '#fff',
            background: 'linear-gradient(135deg, #124DA3 0%, #4EB748 100%)',
            boxShadow: '0 8px 32px rgba(18, 77, 163, 0.12)'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, md: 8 }}>
              <Typography variant="h3" fontWeight={800} gutterBottom>
                Xin chào, {user?.fullName || user?.name || 'Học viên'}! 👋
              </Typography>
              <Typography variant="subtitle1" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                Chào mừng bạn đến với Nền tảng Lộ trình Học tập Học Mẹo. Hãy khám phá giới thiệu nền tảng và thông tin nhà phát triển bên dưới.
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Section 1: Trang Landing Giới Thiệu Nền Tảng */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Stack spacing={2.5}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Book size={24} color="#124DA3" />
              <Typography variant="h4" fontWeight={700}>
                Giới Thiệu Nền Tảng Học Mẹo
              </Typography>
            </Box>

            <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
              <strong>Học Mẹo</strong> là hệ thống lộ trình học tập lập trình đa nền tảng (Flutter Mobile & Web Portal) được xây dựng nhằm mang lại trải nghiệm học tập cá nhân hóa, dễ tiếp thu và trực quan nhất cho học viên.
            </Typography>

            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Card variant="outlined" sx={{ borderRadius: 2, height: '100%', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Code size={28} color="#4EB748" />
                    <Typography variant="h6" fontWeight={700} sx={{ mt: 1.5 }}>
                      Lộ trình phân tầng
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                      Hệ thống cấu trúc bài học chi tiết theo dạng Topic &rarr; Blog &rarr; StepNode thực hành từng bước.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Card variant="outlined" sx={{ borderRadius: 2, height: '100%', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <DirectNotification size={28} color="#124DA3" />
                    <Typography variant="h6" fontWeight={700} sx={{ mt: 1.5 }}>
                      Đăng ký Premium
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                      Học viên gửi Yêu cầu nâng cấp tài khoản (Plan Request) trực tiếp trên Mobile App để mở khóa nội dung nâng cao.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Card variant="outlined" sx={{ borderRadius: 2, height: '100%', borderColor: 'divider' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <ShieldSecurity size={28} color="#e5a100" />
                    <Typography variant="h6" fontWeight={700} sx={{ mt: 1.5 }}>
                      Đồng bộ đa nền tảng
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.6 }}>
                      Tiến độ bài học, điểm trắc nghiệm Quiz và chuỗi ngày Streak được đồng bộ tức thì trên thiết bị di động.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Paper>

        {/* Section 2: Chính Sách Nhà Phát Triển & Bảo Mật */}
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Stack spacing={2.5}>
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
              <Box display="flex" alignItems="center" gap={1.5}>
                <ShieldSecurity size={24} color="#4EB748" />
                <Typography variant="h4" fontWeight={700}>
                  Chính Sách Nhà Phát Triển & Bảo Mật Dữ Liệu
                </Typography>
              </Box>
              <Chip label="Cam kết bảo mật" color="success" size="small" variant="outlined" />
            </Box>

            <Typography variant="body1" color="text.secondary" lineHeight={1.8}>
              Đội ngũ phát triển <strong>Học Mẹo Platform</strong> cam kết tuân thủ đầy đủ các tiêu chuẩn an toàn thông tin và chính sách quyền riêng tư dành cho ứng dụng di động theo quy định kiểm duyệt của Google Play, App Store và Zalo Mini App.
            </Typography>

            <Box sx={{ p: 2.5, bgcolor: 'action.hover', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
              <Stack spacing={1}>
                <Typography variant="subtitle1" fontWeight={700}>
                  Thông tin ứng dụng & Liên hệ hỗ trợ:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Nền tảng: <strong>Học Mẹo Learning Platform</strong> (Cross-platform Flutter & React Web)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Mã định danh gói (Application ID): <code>{APP_PACKAGE_ID}</code>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Email hỗ trợ nhà phát triển:{' '}
                  <Typography
                    component="a"
                    href={`mailto:${SUPPORT_EMAIL}`}
                    sx={{
                      color: 'primary.main',
                      fontWeight: 600,
                      textDecoration: 'none',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    {SUPPORT_EMAIL}
                  </Typography>
                </Typography>
              </Stack>
            </Box>

            <Box display="flex" justifyContent="flex-start" sx={{ pt: 1 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<DocumentText size={18} />}
                onClick={() => navigate('/privacy')}
                sx={{ borderRadius: 2, px: 3, py: 1 }}
              >
                Xem chi tiết Chính sách quyền riêng tư
              </Button>
            </Box>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
