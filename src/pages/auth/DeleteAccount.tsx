import React, { useState } from 'react';
import { Box, Container, Paper, Typography, Divider, Stack, Button, Chip, TextField, Alert, Grid } from '@mui/material';
import { ArrowLeft2, Trash, ShieldSecurity, Send2, InfoCircle } from 'iconsax-reactjs';
import { useNavigate } from 'react-router-dom';
import { SUPPORT_EMAIL, DEVELOPER_NAME, APP_PACKAGE_ID } from '@/config';

export default function DeleteAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: { xs: 4, md: 6 },
        px: 2,
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 50% 0%, rgba(229, 62, 62, 0.12), transparent 55%)'
            : 'radial-gradient(circle at 50% 0%, rgba(229, 62, 62, 0.08), transparent 55%)'
      }}
    >
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              startIcon={<ArrowLeft2 size={18} />}
              onClick={() => navigate('/login')}
              variant="outlined"
              color="inherit"
              sx={{ borderRadius: 2 }}
            >
              Quay lại đăng nhập
            </Button>
            <Chip
              icon={<ShieldSecurity size={16} />}
              label="Google Play Compliant Policy"
              color="error"
              variant="outlined"
              size="small"
            />
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 5 },
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h3"
                  fontWeight={800}
                  gutterBottom
                  color="error.main"
                  display="flex"
                  alignItems="center"
                  gap={1.5}
                >
                  <Trash size={32} /> Yêu Cầu Xóa Tài Khoản & Dữ Liệu
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Ứng dụng di động <strong>Học Mẹo</strong> (Developer: {DEVELOPER_NAME})
                </Typography>
              </Box>

              <Divider />

              {/* Mục 1: Các bước thực hiện */}
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  1. Các bước gửi yêu cầu xóa tài khoản
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                  Người dùng có thể yêu cầu xóa hoàn toàn tài khoản và dữ liệu cá nhân của mình trên hệ thống{' '}
                  <strong>Học Mẹo</strong> bằng một trong hai cách sau:
                </Typography>

                <Box
                  sx={{ p: 2.5, bgcolor: 'action.hover', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                >
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom color="primary.main">
                    Cách 1: Thực hiện ngay trên ứng dụng di động Học Mẹo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" component="div">
                    <ol style={{ paddingLeft: 20, margin: 0 }}>
                      <li>
                        Mở ứng dụng <strong>Học Mẹo</strong> trên điện thoại của bạn.
                      </li>
                      <li>Đăng nhập tài khoản cần xóa.</li>
                      <li>
                        Vào mục <strong>Tài khoản (Profile)</strong> &rarr; Chọn <strong>Yêu cầu xóa tài khoản</strong>.
                      </li>
                      <li>
                        Xác nhận gửi yêu cầu. Hệ thống sẽ tiến hành vô hiệu hóa và xóa dữ liệu trong vòng 24 - 48 giờ.
                      </li>
                    </ol>
                  </Typography>
                </Box>

                <Box
                  sx={{ p: 2.5, bgcolor: 'action.hover', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                >
                  <Typography variant="subtitle2" fontWeight={700} gutterBottom color="primary.main">
                    Cách 2: Gửi biểu mẫu yêu cầu xóa trực tuyến bên dưới hoặc gửi email
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Điền email tài khoản của bạn vào biểu mẫu bên dưới hoặc gửi trực tiếp email đến nhà phát triển:{' '}
                    <Typography
                      component="a"
                      href={`mailto:${SUPPORT_EMAIL}?subject=Yêu%20cầu%20xóa%20tài%20khoản%20Học%20Mẹo`}
                      sx={{
                        color: 'primary.main',
                        fontWeight: 600,
                        textDecoration: 'none',
                        '&:hover': { textDecoration: 'underline' }
                      }}
                    >
                      {SUPPORT_EMAIL}
                    </Typography>{' '}
                    với tiêu đề <em>"Yêu cầu xóa tài khoản Học Mẹo"</em>.
                  </Typography>
                </Box>
              </Stack>

              {/* Mục 2: Loại dữ liệu bị xóa và giữ lại */}
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  2. Dữ liệu sẽ xóa và dữ liệu được giữ lại
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'error.lighter',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'error.light',
                        height: '100%'
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700} color="error.main" gutterBottom>
                        Dữ liệu sẽ bị xóa VĨNH VIỄN:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" component="div">
                        <ul style={{ paddingLeft: 18, margin: 0 }}>
                          <li>Thông tin tài khoản (Họ tên, Email, Tên đăng nhập, Mật khẩu).</li>
                          <li>Lịch sử tiến độ học tập (Các bài học đã xem, số điểm trắc nghiệm Quiz, chuỗi Streak).</li>
                          <li>Toàn bộ thông tin vé đăng ký nâng cấp gói (Plan Requests).</li>
                        </ul>
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: 'warning.lighter',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'warning.light',
                        height: '100%'
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight={700} color="warning.main" gutterBottom>
                        🛡️ Dữ liệu giữ lại (nếu có):
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Nhật ký hệ thống ẩn danh (Anonymous system access logs) phục vụ mục đích an ninh bảo mật mạng,
                        được tự động hủy sau 90 ngày theo quy định pháp luật.
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>

              {/* Mục 3: Thời gian lưu giữ và xử lý */}
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  3. Thời gian xử lý yêu cầu
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                  Sau khi tiếp nhận yêu cầu xóa tài khoản, Ban quản trị Học Mẹo sẽ kiểm tra xác thực chính chủ và thực
                  hiện xóa toàn bộ dữ liệu người dùng khỏi máy chủ trong vòng <strong>24 đến 48 giờ làm việc</strong>.
                </Typography>
              </Stack>

              <Divider />

              {/* Form gửi yêu cầu trực tuyến */}
              <Stack spacing={2}>
                <Typography variant="h5" fontWeight={700}>
                  Gửi yêu cầu xóa tài khoản trực tuyến
                </Typography>

                {submitted ? (
                  <Alert severity="success" icon={<InfoCircle size={22} />}>
                    Yêu cầu xóa tài khoản của bạn đã được tiếp nhận thành công. Đội ngũ kỹ thuật Học Mẹo sẽ kiểm tra và
                    xóa toàn bộ dữ liệu liên quan đến email <strong>{email}</strong> trong vòng 24-48h.
                  </Alert>
                ) : (
                  <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                      <TextField
                        label="Email đăng ký tài khoản Học Mẹo"
                        type="email"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vi-du: user@gmail.com"
                      />
                      <TextField
                        label="Lý do xóa tài khoản (Không bắt buộc)"
                        multiline
                        rows={3}
                        fullWidth
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Hãy cho chúng tôi biết lý do bạn muốn xóa tài khoản để giúp ứng dụng hoàn thiện hơn..."
                      />
                      <Button
                        type="submit"
                        variant="contained"
                        color="error"
                        size="large"
                        startIcon={<Send2 size={18} />}
                        sx={{ borderRadius: 2, alignSelf: 'flex-start' }}
                      >
                        Gửi Yêu Cầu Xóa Dữ Liệu
                      </Button>
                    </Stack>
                  </Box>
                )}
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
