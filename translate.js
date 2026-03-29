const fs = require('fs');

try {
    let content = fs.readFileSync('src/pages/AdminDashboard.jsx', 'utf8');

    const replacements = {
        'Quan tri vien': 'Quản trị viên',
        'Luat su': 'Luật sư',
        'Khach hang': 'Khách hàng',
        'Hoan thanh': 'Hoàn thành',
        'Cho xu ly': 'Chờ xử lý',
        'That bai': 'Thất bại',
        'Khong ro': 'Không rõ',
        'Revenue Trend': 'Biểu đồ Doanh thu',
        'Recent Activity': 'Hoạt động gần đây',
        'New contact added': 'Liên hệ mới',
        'John Doe from Acme Corp': 'Nguyễn Văn A từ Tech Corp',
        'Deal closed': 'Giao dịch thành công',
        'Task completed': 'Nhiệm vụ hoàn tất',
        'Follow-up call with Jane Smith': 'Gọi điện thoại chăm sóc khách hàng',
        'Yesterday': 'Hôm qua',
        'Upcoming Tasks': 'Nhiệm vụ sắp tới',
        'Call with prospect': 'Gọi điện cho đối tác',
        'Today at 2:00 PM': 'Hôm nay lúc 2:00 PM',
        'Send proposal': 'Gửi đề xuất',
        'Tomorrow at 10:00 AM': 'Ngày mai lúc 10:00 AM',
        'Review contracts': 'Xem xét hợp đồng',
        'Friday at 3:00 PM': 'Thứ Sáu lúc 3:00 PM',
        'User Management': 'Quản lý Người dùng',
        'Search by name or email...': 'Tìm kiếm theo tên hoặc email...',
        'Full Name': 'Họ và tên',
        '>Email<': '>Email<',
        '>Role<': '>Vai trò<',
        '>Status<': '>Trạng thái<',
        '>Actions<': '>Hành động<',
        'Khong co nguoi dung phu hop.': 'Không có người dùng phù hợp.',
        '>Transactions<': '>Giao dịch<',
        '>Time<': '>Thời gian<',
        '>User<': '>Người dùng<',
        '>Amount<': '>Số tiền<',
        '>TX ID<': '>Mã GD<',
        'Total Reviews': 'Tổng đánh giá',
        'Average Rating': 'Điểm trung bình',
        'Critical Issues': 'Vấn đề nghiêm trọng',
        'Low ratings:': 'Đánh giá thấp:',
        'Recent Reviews': 'Đánh giá gần đây',
        '>Client<': '>Khách hàng<',
        '>Lawyer<': '>Luật sư<',
        '>Rating<': '>Đánh giá<',
        '>Comment<': '>Bình luận<',
        'Khong co noi dung': 'Không có nội dung',
        'Lawyer Approval Queue': 'Danh sách Luật sư chờ duyệt',
        'No lawyers currently waiting for approval': 'Không có luật sư nào đang chờ duyệt',
        'Bar Number': 'Số thẻ Luật sư',
        '>Details</button>': '>Chi tiết</button>',
        '>Approve</button>': '>Phê duyệt</button>',
        '>Reject</button>': '>Từ chối</button>',
        'Settings area is currently under development.': 'Khu vực Cài đặt đang được phát triển.',
        'Documentation area is currently under development.': 'Khu vực Tài liệu đang được phát triển.',
        'User Details': 'Chi tiết Người dùng',
        '>Close</button>': '>Đóng</button>',
        'Created At': 'Ngày tạo',
        'Edit User': 'Chỉnh sửa Người dùng',
        'Account is active': 'Tài khoản đang hoạt động',
        '>Cancel</button>': '>Hủy bỏ</button>',
        '>Save Changes</button>': '>Lưu thay đổi</button>',
        '>Active<': '>Hoạt động<',
        '>Locked<': '>Bị khóa<'
    };

    for (const [eng, vie] of Object.entries(replacements)) {
        // Escaping special regex chars if any, but since these are simple strings we can just use replaceAll if node version >= 15
        // or split/join
        content = content.split(eng).join(vie);
    }

    // Handle some specific ones carefully if needed
    fs.writeFileSync('src/pages/AdminDashboard.jsx', content, 'utf8');
    console.log('Successfully translated AdminDashboard.jsx');
} catch (error) {
    console.error('Error translating:', error);
}
