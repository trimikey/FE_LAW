import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, 'src');

const dictionary = {
    // Safe JSX Exact Tags
    '>Tong quan<': '>Tổng quan<',
    '>Nguoi dung<': '>Người dùng<',
    '>Luat su<': '>Luật sư<',
    '>Quan tri vien<': '>Quản trị viên<',
    '>Khach hang<': '>Khách hàng<',
    '>Giao dich<': '>Giao dịch<',
    '>Danh gia<': '>Đánh giá<',
    '>Cai dat<': '>Cài đặt<',
    '>Tai lieu<': '>Tài liệu<',

    '>Vu viec<': '>Vụ việc<',
    '>Hoan thanh<': '>Hoàn thành<',
    '>Cho xu ly<': '>Chờ xử lý<',
    '>That bai<': '>Thất bại<',
    '>Khong ro<': '>Không rõ<',
    '>Da huy<': '>Đã hủy<',
    '>Huy<': '>Hủy<',
    '>Luu thay doi<': '>Lưu thay đổi<',
    '>Dong<': '>Đóng<',
    '>Cap nhat<': '>Cập nhật<',
    '>Chinh sua<': '>Chỉnh sửa<',
    '>Xoa<': '>Xóa<',
    '>Tao<': '>Tạo<',
    '>Them<': '>Thêm<',
    '>Lich tu van<': '>Lịch tư vấn<',
    '>Video Call<': '>Video Call<',
    '>Gap truc tiep<': '>Gặp trực tiếp<',
    '>Goi dien thoai<': '>Gọi điện thoại<',
    '>Tin nhan<': '>Tin nhắn<',
    '>Ho so<': '>Hồ sơ<',
    '>Chi tiet<': '>Chi tiết<',
    '>Danh sach<': '>Danh sách<',

    '>Tong vu viec<': '>Tổng vụ việc<',
    '>Dang xu ly<': '>Đang xử lý<',
    '>Doanh thu thang<': '>Doanh thu tháng<',
    '>Da xong thang nay<': '>Đã xong tháng này<',
    '>Bieu do vu viec<': '>Biểu đồ vụ việc<',
    '>Khu vuc hien thi bieu do<': '>Khu vực hiển thị biểu đồ<',
    '>Vu viec moi xu ly<': '>Vụ việc mới xử lý<',
    '>Danh sach vu viec<': '>Danh sách vụ việc<',
    '>Chua co vu viec nao da hoan thanh<': '>Chưa có vụ việc nào đã hoàn thành<',
    '>Tim kiem vu viec, khach hang...<': '>Tìm kiếm vụ việc, khách hàng...<',
    '>Tao vu viec<': '>Tạo vụ việc<',
    '>Chua co vu viec nao.<': '>Chưa có vụ việc nào.<',
    '>Tien do<': '>Tiến độ<',
    '>Nhan viec<': '>Nhận việc<',
    '>Them vu viec moi<': '>Thêm vụ việc mới<',
    '>Chua co lich tu van nao<': '>Chưa có lịch tư vấn nào<',
    '>Cho xac nhan<': '>Chờ xác nhận<',
    '>Da xac nhan<': '>Đã xác nhận<',
    '>XAC NHAN<': '>XÁC NHẬN<',
    '>TU CHOI<': '>TỪ CHỐI<',
    '>Tao lich trong moi<': '>Tạo lịch trống mới<',
    '>Thoi gian bat dau<': '>Thời gian bắt đầu<',
    '>Thoi gian ket thuc<': '>Thời gian kết thúc<',
    '>Hinh thuc tu van<': '>Hình thức tư vấn<',
    '>TAO LICH NGAY<': '>TẠO LỊCH NGAY<',
    '>Lich trong hien tai<': '>Lịch trống hiện tại<',
    '>Chua co lich trong nao duoc thiet lap<': '>Chưa có lịch trống nào được thiết lập<',
    '>Xem chi tiet<': '>Xem chi tiết<',
    '>Xoa lich<': '>Xóa lịch<',
    '>Ket thuc:<': '>Kết thúc:<',
    '>Tao ho so khach hang<': '>Tạo hồ sơ khách hàng<',
    '>Ho va Ten<': '>Họ và Tên<',
    '>So Dien Thoai<': '>Số Điện Thoại<',
    '>Dia Chi<': '>Địa Chỉ<',
    '>Ghi Chu Ban Dau<': '>Ghi Chú Ban Đầu<',
    '>Chi tiet lich trong<': '>Chi tiết lịch trống<',
    '>Chinh sua lich trong<': '>Chỉnh sửa lịch trống<',
    '>Ghi chu<': '>Ghi chú<',
    '>Ghi chu tu vai tro khach hang:<': '>Ghi chú từ khách hàng:<',
    '>Dang cho ket noi<': '>Đang chờ kết nối<',
    '>Ket noi on dinh<': '>Kết nối ổn định<',
    '>He thong dang goi den doi tac. Vui long cho ben kia chap nhan.<': '>Hệ thống đang gọi đến đối tác. Vui lòng chờ bên kia chấp nhận.<',
    '>Ban co mot cuoc goi video den. Hay chap nhan de bat dau trao doi.<': '>Bạn có một cuộc gọi video đến. Hãy chấp nhận để bắt đầu trao đổi.<',
    '>Dang ket noi<': '>Đang kết nối<',
    '>Cuoc goi den<': '>Cuộc gọi đến<',
    '>Chap nhan<': '>Chấp nhận<',
    '>Tu choi<': '>Từ chối<',
    '>Tat micro<': '>Tắt micro<',
    '>Bat micro<': '>Bật micro<',
    '>Tat camera<': '>Tắt camera<',
    '>Bat camera<': '>Bật camera<',
    '>Chup nhanh khung hinh<': '>Chụp nhanh khung hình<',
    '>Cai dat cuoc goi<': '>Cài đặt cuộc gọi<',
    '>Ket thuc cuoc goi<': '>Kết thúc cuộc gọi<',
    '>Thong tin vu viec<': '>Thông tin vụ việc<',
    '>Ghi chu cuoc goi<': '>Ghi chú cuộc gọi<',
    '>Tu dong luu...<': '>Tự động lưu...<',
    '>Tai lieu dang chia se<': '>Tài liệu đang chia sẻ<',
    '>Chua co tai lieu nao duoc chia se trong cuoc goi nay.<': '>Chưa có tài liệu nào được chia sẻ trong cuộc gọi này.<',
    '>Gui tin nhan nhanh cho khach hang...<': '>Gửi tin nhắn nhanh cho khách hàng...<',
    '>Gui tin nhan nhanh<': '>Gửi tin nhắn nhanh<',
    '>Ket qua thanh toan MoMo<': '>Kết quả thanh toán MoMo<',
    '>Ket qua thanh toan VietQR<': '>Kết quả thanh toán VietQR<',
    '>Danh gia tu khach hang<': '>Đánh giá từ khách hàng<',

    'placeholder="Tim kiem vu viec, khach hang..."': 'placeholder="Tìm kiếm vụ việc, khách hàng..."',
    'placeholder="Nhap ho ten khach hang"': 'placeholder="Nhập họ tên khách hàng"',
    'placeholder="So nha, ten duong, quan/huyen..."': 'placeholder="Số nhà, tên đường, quận/huyện..."',
    'placeholder="example@gmail.com"': 'placeholder="ví dụ@gmail.com"',

    '>Doanh nghiep SME<': '>Doanh nghiệp SME<',
    '>Hop dong thuong mai<': '>Hợp đồng thương mại<',
    '>Thue va ke toan<': '>Thuế và kế toán<',
    '>Lao dong va nhan su<': '>Lao động và nhân sự<',
    '>Tranh chap kinh doanh<': '>Tranh chấp doanh nghiệp<',

    '>Tong quan tai khoan<': '>Tổng quan tài khoản<',
    '>Vu viec cua toi<': '>Vụ việc của tôi<',
    '>Tim kiem luat su<': '>Tìm kiếm luật sư<',
    '>Trung tam tin nhan<': '>Trung tâm tin nhắn<',
    '>Dat lich tu van<': '>Đặt lịch tư vấn<',
    '>Khach hang chinh (Nguyen don)<': '>Khách hàng chính (Nguyên đơn)<',
    '>Ngay tao<': '>Ngày tạo<',
    'placeholder="Nhap ghi chu quan trong tai day..."': 'placeholder="Nhập ghi chú quan trọng tại đây..."',
    '>Dang nhap<': '>Đăng nhập<',
    '>Dang ky<': '>Đăng ký<',
    '>Trang chu<': '>Trang chủ<',
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

            for (const [key, value] of Object.entries(dictionary)) {
                if (content.includes(key)) {
                    content = content.split(key).join(value);
                }
            }

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Translated safely via exact tags: ${fullPath.substring(srcDir.length)}`);
            }
        }
    }
}

console.log('Starting massive safe translation (Phase 2)...');
processDirectory(srcDir);
console.log('Done.');
