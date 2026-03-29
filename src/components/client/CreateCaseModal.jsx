const CreateCaseModal = ({
  newCase,
  setNewCase,
  setShowCreateCase,
  createCase
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCase();
  };

  const formatNumber = (val) => {
    if (!val) return '';
    return Number(val).toLocaleString('vi-VN');
  };

  const handleFeeChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setNewCase({
      ...newCase,
      estimatedFee: val
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
        <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tight">
          Tạo vụ việc mới
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Tiêu đề vụ việc
              </label>
              <input
                required
                placeholder="VD: Tranh chấp hợp đồng lao động..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all font-semibold"
                value={newCase.title}
                onChange={(e) =>
                  setNewCase({
                    ...newCase,
                    title: e.target.value
                  })
                }
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                Mô tả chi tiết
              </label>
              <textarea
                required
                rows="3"
                placeholder="Mô tả tóm tắt yêu cầu của bạn..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all font-medium"
                value={newCase.description}
                onChange={(e) =>
                  setNewCase({
                    ...newCase,
                    description: e.target.value
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Loại vụ việc
                </label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all font-bold text-slate-700 appearance-none pointer-events-auto"
                  value={newCase.caseType}
                  onChange={(e) =>
                    setNewCase({
                      ...newCase,
                      caseType: e.target.value
                    })
                  }
                >
                  <option value="consultation">Tư vấn</option>
                  <option value="contract">Hợp đồng</option>
                  <option value="dispute">Tranh chấp</option>
                  <option value="corporate">Doanh nghiệp</option>
                  <option value="labor">Lao động</option>
                  <option value="tax">Thuế</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">
                  Mức độ ưu tiên
                </label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all font-bold text-slate-700 appearance-none"
                  value={newCase.priority}
                  onChange={(e) =>
                    setNewCase({
                      ...newCase,
                      priority: e.target.value
                    })
                  }
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Bình thường</option>
                  <option value="high">Cao</option>
                  <option value="urgent">Khẩn cấp</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 ml-1">
                Ngân sách dự kiến (VNĐ)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="0"
                  className="w-full px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl text-lg font-black text-blue-900 focus:outline-none focus:border-blue-500 transition-all"
                  value={formatNumber(newCase.estimatedFee)}
                  onChange={handleFeeChange}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-300 uppercase">VNĐ</span>
              </div>
              <p className="text-[9px] font-bold text-slate-400 mt-2 italic px-1">
                * Lưu ý: Phí này dùng để luật sư tham khảo và báo giá chính xác hơn.
              </p>
            </div>
          </div>

          <div className="mt-8 flex space-x-3">
            <button
              onClick={() => setShowCreateCase(false)}
              className="flex-1 bg-slate-100 text-slate-500 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-200 transition-all"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
            >
              Xác nhận tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCaseModal;
