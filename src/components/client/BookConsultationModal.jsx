import { resolveAvatarUrl } from '../../utils/avatar';

const BookConsultationModal = ({
  selectedLawyer,
  newConsultation,
  setNewConsultation,
  setShowBookConsultation,
  setSelectedLawyer,
  bookConsultation
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    await bookConsultation();
  };

  return (
    <div className="fixed inset-0 bg-[#041837]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-[40px] p-10 max-w-lg w-full shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-0" />

        <h2 className="relative z-10 text-3xl font-black mb-8 text-[#041837] uppercase tracking-tight">
          {selectedLawyer ? `Đặt lịch tư vấn` : 'Lịch tư vấn mới'}
        </h2>

        {selectedLawyer && (
          <div className="relative z-10 flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="h-14 w-14 rounded-2xl bg-[#041837] overflow-hidden border-2 border-white shadow-lg">
              <img src={resolveAvatarUrl(selectedLawyer.avatar)} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">Luật sư hỗ trợ</p>
              <p className="text-xl font-black text-[#041837] uppercase tracking-tight leading-none">{selectedLawyer.full_name}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">
                Thời gian
              </label>
              <input
                type="datetime-local"
                required
                className="mt-1 w-full px-3 py-2 border rounded-lg"
                value={newConsultation.scheduledAt}
                onChange={(e) =>
                  setNewConsultation({
                    ...newConsultation,
                    scheduledAt: e.target.value
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Thời lượng (phút)
              </label>
              <input
                type="number"
                required
                className="mt-1 w-full px-3 py-2 border rounded-lg"
                value={newConsultation.duration}
                onChange={(e) =>
                  setNewConsultation({
                    ...newConsultation,
                    duration: Number(e.target.value)
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Loại tư vấn
              </label>
              <select
                className="mt-1 w-full px-3 py-2 border rounded-lg"
                value={newConsultation.consultationType}
                onChange={(e) =>
                  setNewConsultation({
                    ...newConsultation,
                    consultationType: e.target.value
                  })
                }
              >
                <option value="video">Video call</option>
                <option value="phone">Điện thoại</option>
                <option value="in_person">Gặp trực tiếp</option>
              </select>
            </div>
          </div>

          {!selectedLawyer && (
            <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-relaxed">
                Vui lòng chọn luật sư từ danh sách "Đội ngũ luật sư" trước khi đặt lịch tư vấn.
              </p>
            </div>
          )}

          <div className="mt-8 flex space-x-4">
            <button
              type="submit"
              disabled={!selectedLawyer}
              className={`flex-1 py-4 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl transition-all active:scale-95 ${!selectedLawyer ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-amber-500 text-[#041837] hover:bg-white border-2 border-transparent hover:border-amber-500'}`}
            >
              Đặt lịch ngay
            </button>
            <button
              type="button"
              onClick={() => {
                setShowBookConsultation(false);
                setSelectedLawyer(null);
              }}
              className="flex-1 bg-slate-900 text-white py-4 rounded-3xl font-black uppercase text-xs tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-xl"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookConsultationModal;
