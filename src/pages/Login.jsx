import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PartnerSection from '../components/home/PartnerSection';
import Footer from '../components/home/Footer';
import loginBg from '../assets/back_gr_luat.png';
import CtaSection from '../components/home/CTASection';
import { HiMail, HiLockClosed, HiArrowRight } from 'react-icons/hi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resending, setResending] = useState(false);
  const { login, resendVerification } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNeedsVerification(false);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else if ((result.message || '').toLowerCase().includes('xác thực email')) {
      setNeedsVerification(true);
    }

    setLoading(false);
  };

  const handleResendVerification = async () => {
    if (!formData.email || resending) return;

    setResending(true);
    await resendVerification(formData.email);
    setResending(false);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* LOGIN HERO SECTION */}
      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={loginBg} alt="Law Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#041837] via-[#041837]/90 to-transparent" />
        </div>

        {/* Floating Shapes for Premium Feel */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-amber-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-700" />

        {/* LOGIN FORM CARD */}
        <div className="relative z-10 w-full max-w-xl px-6 py-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="bg-white/80 backdrop-blur-2xl p-6 md:p-16 rounded-3xl md:rounded-[48px] shadow-[0_20px_80px_-15px_rgba(0,0,0,0.3)] border border-white/20">
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-[#041837] rounded-2xl md:rounded-3xl mb-4 md:mb-6 shadow-2xl transform hover:rotate-6 transition-transform">
                <span className="text-2xl md:text-3xl font-black text-amber-500">H</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[#041837] tracking-tight mb-3">Chào mừng trở lại</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">Đăng nhập để tiếp tục đồng hành cùng Hiểu Luật</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#041837] uppercase tracking-[0.2em] ml-2">Email của bạn</label>
                <div className="relative group">
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] focus:ring-8 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-bold text-[#041837] placeholder:text-slate-300"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <HiMail className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-2">
                  <label className="text-[10px] font-black text-[#041837] uppercase tracking-[0.2em]">Mật khẩu</label>
                  <Link to="/forgot-password" size="sm" className="text-[10px] font-black text-amber-600 uppercase tracking-widest hover:text-amber-700">Quên mật khẩu?</Link>
                </div>
                <div className="relative group">
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[24px] focus:ring-8 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-bold text-[#041837] placeholder:text-slate-300"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <HiLockClosed className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 mt-4 bg-[#041837] hover:bg-black text-white font-black uppercase tracking-[0.2em] text-xs rounded-[24px] shadow-2xl shadow-blue-900/40 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'Đang xác thực...' : 'Đăng nhập ngay'}
                {!loading && <HiArrowRight className="h-4 w-4" />}
              </button>
              {needsVerification && (
                <div className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-left">
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-amber-700">
                    Tài khoản chưa xác thực email
                  </p>
                  <p className="mt-2 text-sm font-bold text-slate-600">
                    Nếu bạn chưa nhận được mail hoặc link cũ đã hết hạn, gửi lại email xác thực cho địa chỉ này.
                  </p>
                  <button
                    type="button"
                    onClick={handleResendVerification}
                    disabled={resending || !formData.email}
                    className="mt-4 inline-flex items-center justify-center rounded-full bg-amber-500 px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#041837] transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {resending ? 'Đang gửi lại...' : 'Gửi lại email xác thực'}
                  </button>
                </div>
              )}
            </form>

            <div className="mt-12 text-center">
              <p className="text-slate-400 font-bold text-sm">
                Chưa có tài khoản?{' '}
                <Link
                  to="/signup"
                  className="text-amber-600 hover:text-amber-700 transition"
                >
                  Bắt đầu đăng ký miễn phí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ADDITIONAL SECTIONS */}
      <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
        <PartnerSection />
        <CtaSection />
        <Footer />
      </div>
    </div>
  );
};

export default Login;
