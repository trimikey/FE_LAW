export const CASE_STEP_DETAILS = {
    'INTAKE': {
        title: 'INTAKE – Thu thập thông tin ban đầu',
        subtitle: '(Giai đoạn tiếp nhận vụ việc)',
        objective: 'Hiểu toàn bộ vấn đề pháp lý người dân đang gặp.',
        actions: [
            {
                label: 'Bước 1: Mô tả vụ việc',
                details: ['Chuyện gì xảy ra', 'Khi nào xảy ra', 'Liên quan đến ai']
            },
            {
                label: 'Bước 2: Xác định loại vi phạm',
                table: {
                    headers: ['Tình huống', 'Nhóm vấn đề'],
                    rows: [
                        ['Bán hàng online', 'Thuế'],
                        ['Bán đất', 'Thuế chuyển nhượng'],
                        ['Mở quán ăn', 'Kinh doanh']
                    ]
                }
            },
            {
                label: 'Bước 3: Kiểm tra thông báo',
                details: ['Thông báo thuế', 'Giấy mời làm việc', 'Quyết định xử phạt']
            }
        ],
        output: ['Mô tả vụ việc', 'Xác định loại vi phạm', 'Xác định cơ quan xử lý']
    },
    'DOCUMENT REVIEW': {
        title: 'DOCUMENT REVIEW – Rà soát tài liệu',
        subtitle: '(Xem toàn bộ giấy tờ liên quan)',
        objective: 'Kiểm tra bằng chứng và hồ sơ pháp lý.',
        sections: [
            {
                label: 'Người dân cần chuẩn bị',
                table: {
                    headers: ['Loại hồ sơ', 'Ví dụ'],
                    rows: [
                        ['giấy tờ cá nhân', 'CMND / CCCD'],
                        ['giao dịch tài chính', 'sao kê ngân hàng'],
                        ['kinh doanh', 'đơn hàng'],
                        ['tài sản', 'hợp đồng mua bán']
                    ]
                }
            },
            {
                label: 'Thực tế (Ví dụ: Nghi trốn thuế bán online)',
                details: [
                    'Chuẩn bị: lịch sử đơn hàng',
                    'Chuẩn bị: sao kê tài khoản',
                    'Chuẩn bị: hóa đơn'
                ]
            },
            {
                label: 'Việc luật sư sẽ làm',
                details: [
                    'Kiểm tra tính hợp pháp của hồ sơ',
                    'Xác định các tài liệu còn thiếu'
                ]
            }
        ],
        output: ['danh sách tài liệu', 'phát hiện rủi ro']
    },
    'ASSESSMENT': {
        title: 'ASSESSMENT – Đánh giá hồ sơ',
        subtitle: '(Phân tích pháp lý)',
        objective: 'Xác định mức độ vi phạm.',
        sections: [
            {
                label: 'Phân loại mức độ vụ việc',
                table: {
                    headers: ['mức độ', 'ví dụ'],
                    rows: [
                        ['nhẹ', 'không đăng ký hộ kinh doanh'],
                        ['trung bình', 'khai sai thuế'],
                        ['nặng', 'trốn thuế lớn']
                    ]
                }
            },
            {
                label: 'Kiểm tra 3 yếu tố quan trọng',
                details: [
                    '1️ Có vi phạm pháp luật thật hay không?',
                    '2️ Mức xử phạt tối đa có thể áp dụng?',
                    '3️ Có các tình tiết để giảm nhẹ không?'
                ]
            },
            {
                label: 'Ví dụ: Số tiền trốn thuế',
                table: {
                    headers: ['Số tiền trốn thuế', 'Hướng xử lý'],
                    rows: [
                        ['Dưới 100 triệu', 'Xử phạt hành chính'],
                        ['Trên 100 triệu', 'Có thể truy cứu hình sự']
                    ]
                }
            }
        ],
        output: ['mức độ rủi ro', 'hướng xử lý']
    },
    'PREPARATION': {
        title: 'PREPARATION – Chuẩn bị hồ sơ',
        subtitle: '(Chuẩn bị giải quyết vụ việc)',
        objective: 'Chuẩn bị tài liệu pháp lý và phương án xử lý.',
        sections: [
            {
                label: 'Người dân cần phối hợp',
                details: [
                    'Chuẩn bị hồ sơ giải trình chi tiết',
                    'Giải thích nguồn gốc dòng tiền',
                    'Giải thích nội dung các giao dịch'
                ]
            },
            {
                label: 'Chuẩn bị các tài liệu chuyên dụng',
                table: {
                    headers: ['Loại tài liệu', 'Mục đích'],
                    rows: [
                        ['tờ khai thuế bổ sung', 'Khắc phục sai sót'],
                        ['văn bản giải trình', 'Xin giảm nhẹ mức phạt'],
                        ['chứng cứ bổ trợ', 'Tăng cường khả năng bảo vệ']
                    ]
                }
            },
            {
                label: '3 chiến lược xử lý thường dùng',
                details: [
                    '1️ Tự khắc phục (Chủ động nộp thuế)',
                    '2️ Giải trình (Chứng minh không vi phạm)',
                    '3️ Khiếu nại (Nếu quyết định của cơ quan sai)'
                ]
            }
        ],
        output: ['bộ hồ sơ hoàn chỉnh', 'chiến lược xử lý']
    },
    'SUBMISSION': {
        title: 'SUBMISSION – Nộp hồ sơ',
        subtitle: '(Làm việc với cơ quan nhà nước)',
        objective: 'Nộp hồ sơ và giải quyết vụ hiệu quả.',
        sections: [
            {
                label: 'Các cơ quan liên quan',
                table: {
                    headers: ['Cơ quan xử lý', 'Lĩnh vực'],
                    rows: [
                        ['cơ quan thuế', 'Vấn đề về thuế'],
                        ['UBND', 'Xử phạt hành chính'],
                        ['công an', 'Vấn đề hình sự'],
                        ['tòa án', 'Giải quyết tranh chấp']
                    ]
                }
            },
            {
                label: 'Người dân cần làm',
                details: [
                    '1️ Tiến hành nộp hồ sơ theo hướng dẫn',
                    '2️ Tham gia đầy đủ các buổi làm việc',
                    '3️ Rà soát và kỹ biên bản làm việc'
                ]
            },
            {
                label: '⚠️ Lưu ý quan trọng',
                details: [
                    'Tuyệt đối không khai sai thông tin',
                    'Không che giấu hoặc hủy hoại hồ sơ'
                ]
            }
        ],
        output: ['biên bản làm việc', 'quyết định xử phạt']
    },
    'FOLLOW-UP': {
        title: 'FOLLOW-UP – Theo dõi và khắc phục',
        subtitle: '(Giai đoạn sau xử lý)',
        objective: 'Hoàn tất nghĩa vụ pháp lý và tránh tái phạm.',
        sections: [
            {
                label: 'Bước 1: Thực hiện các quyết định',
                details: [
                    'Nộp tiền phạt vào ngân sách',
                    'Hoàn tất nộp các loại thuế bổ sung'
                ]
            },
            {
                label: 'Bước 2: Cải thiện hệ thống kinh doanh',
                details: [
                    'Tiến hành đăng ký hộ kinh doanh',
                    'Thiết lập và mở sổ sách kế toán'
                ]
            },
            {
                label: 'Bước 3: Lưu trữ và theo dõi hồ sơ',
                details: [
                    'Lưu trữ biên lai đóng tiền',
                    'Lưu trữ các quyết định xử phạt/kết luận'
                ]
            }
        ],
        output: ['vụ việc được đóng', 'hệ thống tuân thủ']
    }
};

// Aliases for backward compatibility with old step names
CASE_STEP_DETAILS['LEGAL ASSESSMENT'] = CASE_STEP_DETAILS['ASSESSMENT'];
CASE_STEP_DETAILS['SOLUTION & ACTION'] = CASE_STEP_DETAILS['PREPARATION'];
CASE_STEP_DETAILS['COMPLETION'] = CASE_STEP_DETAILS['FOLLOW-UP'];
