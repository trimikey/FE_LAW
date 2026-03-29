export const STATUS_COLOR = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  confirmed: 'bg-green-100 text-green-800'
};

export const STATUS_TEXT = {
  pending: 'Chờ xử lý',
  in_progress: 'Đang xử lý',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
  confirmed: 'Đã xác nhận'
};

export const getStatusColor = (status) =>
  STATUS_COLOR[status] || 'bg-gray-100 text-gray-800';

export const getStatusText = (status) =>
  STATUS_TEXT[status] || status;
