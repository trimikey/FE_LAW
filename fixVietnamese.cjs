const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const dictionary = {
    // English to Vietnamese
    'Meeting Notes': 'Ghi chú họp',
    'Documents': 'Tài liệu',
    'Video call': 'Cuộc gọi video',
    'Dashboard': 'Trang chủ',
    'Overview': 'Tổng quan',
    'Cases': 'Vụ việc',
    'Lawyers': 'Luật sư',
    'Consultations': 'Lịch tư vấn',
    'Messages': 'Tin nhắn',
    'Settings': 'Cài đặt',
    'Profile': 'Hồ sơ',
    'Logout': 'Đăng xuất',
    'Search': 'Tìm kiếm',
    'Status': 'Trạng thái',
    'Actions': 'Hành động',
    'Details': 'Chi tiết',

    // Unaccented Vietnamese to Accented Vietnamese - Common
    'Khach hang': 'Khách hàng',
    'Luat su': 'Luật sư',
    'Quan tri vien': 'Quản trị viên',
    'Nguoi dung': 'Người dùng',
    'Tong quan': 'Tổng quan',
    'Giao dich': 'Giao dịch',
    'Danh gia': 'Đánh giá',
    'Tai lieu': 'Tài liệu',
    'Dang xu ly': 'Đang xử lý',
    'Hoan thanh': 'Hoàn thành',
    'Cho xu ly': 'Chờ xử lý',
    'That bai': 'Thất bại',
    'Khong ro': 'Không rõ',
    'Da huy': 'Đã hủy',
    'Huy': 'Hủy',
    'Luu thay doi': 'Lưu thay đổi',
    'Dong': 'Đóng',
    'Cap nhat': 'Cập nhật',
    'Chinh sua': 'Chỉnh sửa',
    'Xoa': 'Xóa',
    'Tao': 'Tạo',
    'Them': 'Thêm',

    // Lawyer Dashboard specifics
    'Tong vu viec': 'Tổng vụ việc',
    'Doanh thu thang': 'Doanh thu tháng',
    'Da xong thang nay': 'Đã xong tháng này',
    'Bieu do vu viec': 'Biểu đồ vụ việc',
    'Khu vuc hien thi bieu do': 'Khu vực hiển thị biểu đồ',
    'Vu viec moi xu ly': 'Vụ việc mới xử lý',
    'Danh sach vu viec': 'Danh sách vụ việc',
    'Chua co vu viec nao da hoan thanh': 'Chưa có vụ việc nào đã hoàn thành',
    'Tim kiem vu viec, khach hang...': 'Tìm kiếm vụ việc, khách hàng...',
    'Tao vu viec': 'Tạo vụ việc',
    'Chua co vu viec nao.': 'Chưa có vụ việc nào.',
    'Tien do': 'Tiến độ',
    'Nhan viec': 'Nhận việc',
    'Them vu viec moi': 'Thêm vụ việc mới',
    'Hien thi': 'Hiển thị',
    'trong tong so': 'trong tổng số',
    'Chua co lich tu van nao': 'Chưa có lịch tư vấn nào',
    'Cho xac nhan': 'Chờ xác nhận',
    'Da xac nhan': 'Đã xác nhận',
    'XAC NHAN': 'XÁC NHẬN',
    'TU CHOI': 'TỪ CHỐI',
    'Tao lich trong moi': 'Tạo lịch trống mới',
    'Thoi gian bat dau': 'Thời gian bắt đầu',
    'Thoi gian ket thuc': 'Thời gian kết thúc',
    'Hinh thuc tu van': 'Hình thức tư vấn',
    'Goi dien thoai': 'Gọi điện thoại',
    'Gap truc tiep': 'Gặp trực tiếp',
    'TAO LICH NGAY': 'TẠO LỊCH NGAY',
    'Lich trong hien tai': 'Lịch trống hiện tại',
    'Chua co lich trong nao duoc thiet lap': 'Chưa có lịch trống nào được thiết lập',
    'Xem chi tiet': 'Xem chi tiết',
    'Xoa lich': 'Xóa lịch',
    'Ket thuc:': 'Kết thúc:',
    'Tao ho so khach hang': 'Tạo hồ sơ khách hàng',
    'Ho va Ten': 'Họ và Tên',
    'So Dien Thoai': 'Số Điện Thoại',
    'Dia Chi': 'Địa Chỉ',
    'Ghi Chu Ban Dau': 'Ghi Chú Ban Đầu',
    'Nhap ho ten khach hang': 'Nhập họ tên khách hàng',
    'So nha, ten duong, quan/huyen...': 'Số nhà, tên đường, quận/huyện...',
    'Chi tiet lich trong': 'Chi tiết lịch trống',
    'Chinh sua lich trong': 'Chỉnh sửa lịch trống',
    'Ghi chu': 'Ghi chú',
    'Dang cho ket noi': 'Đang chờ kết nối',
    'Tu van:': 'Tư vấn:',
    'Ket noi on dinh': 'Kết nối ổn định',
    'He thong dang goi den doi tac. Vui long cho ben kia chap nhan.': 'Hệ thống đang gọi đến đối tác. Vui lòng chờ bên kia chấp nhận.',
    'Ban co mot cuoc goi video den. Hay chap nhan de bat dau trao doi.': 'Bạn có một cuộc gọi video đến. Hãy chấp nhận để bắt đầu trao đổi.',
    'Dang ket noi': 'Đang kết nối',
    'Cuoc goi den': 'Cuộc gọi đến',
    'Chap nhan': 'Chấp nhận',
    'Tu choi': 'Từ chối',
    'Tat micro': 'Tắt micro',
    'Bat micro': 'Bật micro',
    'Tat camera': 'Tắt camera',
    'Bat camera': 'Bật camera',
    'Chup nhanh khung hinh': 'Chụp nhanh khung hình',
    'Cai dat cuoc goi': 'Cài đặt cuộc gọi',
    'Ket thuc cuoc goi': 'Kết thúc cuộc gọi',
    'Thong tin vu viec': 'Thông tin vụ việc',
    'Ghi chu cuoc goi': 'Ghi chú cuộc gọi',
    'Tu dong luu...': 'Tự động lưu...',
    'Tai lieu dang chia se': 'Tài liệu đang chia sẻ',
    'Chua co tai lieu nao duoc chia se trong cuoc goi nay.': 'Chưa có tài liệu nào được chia sẻ trong cuộc gọi này.',
    'Gui tin nhan nhanh cho khach hang...': 'Gửi tin nhắn nhanh cho khách hàng...',
    'Gui tin nhan nhanh': 'Gửi tin nhắn nhanh',
    'Thanh toan': 'Thanh toán',
    'Ket qua thanh toan MoMo': 'Kết quả thanh toán MoMo',
    'Ket qua thanh toan VietQR': 'Kết quả thanh toán VietQR',
    'Danh gia tu khach hang': 'Đánh giá từ khách hàng'
};

function processDirectory(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (stat.isFile() && (fullPath.endsWith('.jsx') || fullPath.endsWith('.js'))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Perform replacements
            for (const [key, value] of Object.entries(dictionary)) {
                // Regex with word boundaries to avoid replacing substrings inside words
                // We handle exact casing as well to minimize side effects on imports/code.
                // E.g. replace /Ho va Ten/g with 'Họ và Tên'

                // Split and join is safer across multilines unless we need actual regex
                if (content.includes(key)) {
                    // Using a simple split and join as a global replace for exact string matching.
                    // This works well if it matches exactly.
                    content = content.split(key).join(value);
                }
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(\`Translated: \${fullPath.substring(srcDir.length)}\`);
      }
    }
  }
}

console.log('Starting massive translation...');
processDirectory(srcDir);
console.log('Done.');
