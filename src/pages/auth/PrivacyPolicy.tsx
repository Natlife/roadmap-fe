import React from 'react';
import { Box, Container, Paper, Typography, Divider, Stack, Button, Chip } from '@mui/material';
import { ArrowLeft2, ShieldSecurity } from 'iconsax-reactjs';
import { useNavigate } from 'react-router-dom';
import { SUPPORT_EMAIL, DEVELOPER_NAME } from '@/config';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        py: { xs: 4, md: 6 },
        px: 2,
        backgroundImage: (theme) =>
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at 50% 0%, rgba(78,183,72,0.12), transparent 55%)'
            : 'radial-gradient(circle at 50% 0%, rgba(78,183,72,0.08), transparent 55%)'
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
              label="Cập nhật lần cuối: 05/08/2026"
              color="success"
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
                <Typography variant="h3" fontWeight={800} gutterBottom color="primary.main">
                  Chính Sách Quyền Riêng Tư (Privacy Policy)
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Ứng dụng di động & Nền tảng Học Tập <strong>Học Mẹo</strong>
                </Typography>
              </Box>

              <Divider />

              {/* Mục 1 */}
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700} display="flex" alignItems="center" gap={1}>
                  1. Giới thiệu & Phạm vi áp dụng
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                  Chào mừng bạn đến với ứng dụng <strong>Học Mẹo</strong>. Chúng tôi tôn trọng quyền riêng tư của bạn và
                  cam kết bảo vệ thông tin cá nhân của người dùng khi trải nghiệm nền tảng học tập, xem bài giảng lập
                  trình và gửi yêu cầu đăng ký nâng cấp gói học (Plan Request). Chính sách quyền riêng tư này giải thích
                  cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu của bạn.
                </Typography>
              </Stack>

              {/* Mục 2 */}
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700} display="flex" alignItems="center" gap={1}>
                  2. Thông tin chúng tôi thu thập
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                  Khi bạn sử dụng ứng dụng <strong>Học Mẹo</strong>, chúng tôi chỉ thu thập các thông tin cần thiết nhằm
                  cung cấp dịch vụ tốt nhất:
                </Typography>
                <Box component="ul" sx={{ pl: 3, color: 'text.secondary', m: 0 }}>
                  <li>
                    <strong>Thông tin tài khoản:</strong> Tên đăng nhập / Email và Mật khẩu (đã mã hóa an toàn).
                  </li>
                  <li>
                    <strong>Thông tin đăng ký Premium:</strong> Họ tên, Số điện thoại và Lý do nhu cầu học tập khi bạn
                    chủ động gửi form yêu cầu duyệt nâng cấp tài khoản.
                  </li>
                  <li>
                    <strong>Dữ liệu tiến trình học:</strong> Các bài học, chủ đề, điểm số Quiz và số ngày chuỗi học
                    (streak) bạn đã hoàn thành trên ứng dụng.
                  </li>
                  <li>
                    <strong>Thông tin kỹ thuật thiết bị:</strong> Loại thiết bị, hệ điều hành (Android / iOS) phục vụ
                    việc tối ưu hiển thị ứng dụng.
                  </li>
                </Box>
              </Stack>

              {/* Mục 3 */}
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700} display="flex" alignItems="center" gap={1}>
                  3. Mục đích sử dụng thông tin
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                  Thông tin được thu thập chỉ sử dụng cho các mục đích chính đáng sau:
                </Typography>
                <Box component="ul" sx={{ pl: 3, color: 'text.secondary', m: 0 }}>
                  <li>Xác thực quyền truy cập tài khoản người học vào các nội dung học tập.</li>
                  <li>
                    Xử lý và duyệt các Ticket yêu cầu nâng cấp tài khoản lên gói <code>PREMIUM</code> từ Ban quản trị.
                  </li>
                  <li>Đồng bộ tiến độ học tập trên các thiết bị cá nhân của bạn.</li>
                  <li>Gửi thông báo tiến độ bài học hoặc phản hồi kết quả yêu cầu hỗ trợ.</li>
                </Box>
              </Stack>

              {/* Mục 4 */}
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  4. Lưu trữ và Bảo mật thông tin
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                  Chúng tôi áp dụng các tiêu chuẩn an toàn thông tin khắt khe: mật khẩu người dùng được băm mã hóa bằng
                  thuật toán <strong>bcrypt</strong>, dữ liệu được truyền tải qua chứng chỉ bảo mật HTTPS mã hóa
                  SSL/TLS. Hệ thống cơ sở dữ liệu lưu trữ tại trung tâm dữ liệu an toàn và được sao lưu định kỳ. Chúng
                  tôi cam kết tuyệt đối <strong>KHÔNG bán, chia sẻ hoặc tiết lộ</strong> thông tin cá nhân của bạn cho
                  bất kỳ bên thứ ba nào vì mục đích thương mại.
                </Typography>
              </Stack>

              {/* Mục 5 */}
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  5. Quyền của người dùng & Yêu cầu xóa dữ liệu
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                  Bạn có toàn quyền truy cập, kiểm tra và yêu cầu cập nhật thông tin cá nhân của mình. Nếu bạn muốn xóa
                  tài khoản hoặc yêu cầu hủy toàn bộ dữ liệu cá nhân lưu trữ trên ứng dụng <strong>Học Mẹo</strong>, bạn
                  có thể gửi yêu cầu hỗ trợ trực tiếp từ ứng dụng di động hoặc sử dụng{' '}
                  <Typography
                    component="a"
                    href="/delete-account"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/delete-account');
                    }}
                    sx={{ color: 'error.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    Trang Yêu Cầu Xóa Tài Khoản & Dữ Liệu
                  </Typography>
                  . Chúng tôi sẽ xử lý yêu cầu hủy dữ liệu trong vòng 24 - 48 giờ làm việc.
                </Typography>
              </Stack>

              {/* Mục 6 */}
              <Stack spacing={1}>
                <Typography variant="h5" fontWeight={700}>
                  6. Thông tin liên hệ
                </Typography>
                <Typography variant="body1" color="text.secondary" lineHeight={1.7}>
                  Mọi thắc mắc hoặc góp ý liên quan đến Chính sách quyền riêng tư này, xin vui lòng liên hệ với Ban quản
                  trị Học Mẹo:
                </Typography>
                <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Đội ngũ Phát triển Học Mẹo ({DEVELOPER_NAME})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email hỗ trợ:{' '}
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
                </Box>
              </Stack>

              <Divider />

              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/login')}
                  size="large"
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  Tôi đã hiểu & Quay lại Đăng nhập
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
}
