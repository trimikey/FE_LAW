import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import PartnerSection from '../components/home/PartnerSection'
import Footer from '../components/home/Footer'
import CtaSection from '../components/home/CTASection'
import signupBg from '../assets/back_gr_luat.png'
import { HiUser, HiMail, HiPhone, HiLockClosed, HiIdentification, HiOfficeBuilding, HiTranslate, HiClock, HiCheckCircle, HiArrowRight, HiEye, HiEyeOff } from 'react-icons/hi'

const Signup = () => {
  const [accountType, setAccountType] = useState('client') // 'client' or 'lawyer'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    roleId: 3, // Default: client
    lawyerInfo: {
      barNumber: '',
      certificateNumber: '',
      licenseIssuedDate: '',
      licenseExpiryDate: '',
      lawFirm: '',
      yearsOfExperience: '',
      expectedSalary: '',
      specialties: [],
      bio: ''
    }
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { signup } = useAuth()
  const [licenseFile, setLicenseFile] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const specialtiesList = [
    'LUẬT DOANH NGHIỆP',
    'LUẬT ĐẦU TƯ',
    'THƯƠNG MẠI QUỐC TẾ',
    'HỢP ĐỒNG KINH DOANH',
    'LAO ĐỘNG & NHÂN SỰ',
    'SỞ HỮU TRÍ TUỆ',
    'PHÁ SẢN & TÁI CẤU TRÚC',
    'TÀI CHÍNH & NGÂN HÀNG',
    'THUẾ (DOANH NGHIỆP)',
    'M&A (MUA BÁN SÁP NHẬP)',
    'GIẢI QUYẾT TRANH CHẤP KT',
    'BẤT ĐỘNG SẢN DN'
  ]

  const navigate = useNavigate()

  const handleAccountTypeChange = (type) => {
    setAccountType(type)
    setFormData({
      ...formData,
      roleId: type === 'lawyer' ? 2 : 3,
      lawyerInfo: type === 'lawyer' ? { ...formData.lawyerInfo, specialties: [] } : formData.lawyerInfo
    })
    setErrors({})
  }

  const handleSpecialtyToggle = (specialty) => {
    const currentSpecialties = formData.lawyerInfo.specialties || [];
    const newSpecialties = currentSpecialties.includes(specialty)
      ? currentSpecialties.filter(s => s !== specialty)
      : [...currentSpecialties, specialty];

    setFormData({
      ...formData,
      lawyerInfo: {
        ...formData.lawyerInfo,
        specialties: newSpecialties
      }
    });

    if (errors['lawyer.specialties']) {
      setErrors({ ...errors, ['lawyer.specialties']: '' });
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.startsWith('lawyer.')) {
      const field = name.replace('lawyer.', '')
      setFormData({
        ...formData,
        lawyerInfo: {
          ...formData.lawyerInfo,
          [field]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.email) newErrors.email = 'Email là bắt buộc'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email không hợp lệ'

    if (!formData.password) newErrors.password = 'Mật khẩu là bắt buộc'
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự'

    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    if (!formData.fullName || formData.fullName.length < 2) newErrors.fullName = 'Họ tên quá ngắn'

    if (accountType === 'lawyer') {
      if (!formData.lawyerInfo.barNumber) newErrors['lawyer.barNumber'] = 'Số thẻ luật sư là bắt buộc'

      const years = Number(formData.lawyerInfo.yearsOfExperience)
      if (!formData.lawyerInfo.yearsOfExperience) newErrors['lawyer.yearsOfExperience'] = 'Kinh nghiệm là bắt buộc'
      else if (years < 1 || years > 60)
        newErrors['lawyer.yearsOfExperience'] = 'Kinh nghiệm thực chiến phải từ 1-60 năm'

      const salary = Number(formData.lawyerInfo.expectedSalary)
      if (!formData.lawyerInfo.expectedSalary) newErrors['lawyer.expectedSalary'] = 'Lương mong muốn là bắt buộc'
      else if (salary < 100000 || salary > 500000000)
        newErrors['lawyer.expectedSalary'] = 'Phí tư vấn phải từ 100.000đ đến 500.000.000đ'

      if (!formData.lawyerInfo.specialties || formData.lawyerInfo.specialties.length === 0)
        newErrors['lawyer.specialties'] = 'Vui lòng chọn ít nhất 1 lĩnh vực chuyên môn'
      if (!licenseFile) newErrors.licenseFile = 'Vui lòng upload chứng chỉ'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    const formDataToSend = new FormData()
    formDataToSend.append('email', formData.email)
    formDataToSend.append('password', formData.password)
    formDataToSend.append('fullName', formData.fullName)
    formDataToSend.append('phone', formData.phone || '')
    formDataToSend.append('roleId', formData.roleId)

    if (accountType === 'lawyer') {
      const lawyerData = {
        ...formData.lawyerInfo,
        consultationFee: Number(formData.lawyerInfo.expectedSalary) * 1.15
      };
      formDataToSend.append('lawyerInfo', JSON.stringify(lawyerData))
      formDataToSend.append('licenseFile', licenseFile)
    }

    const result = await signup(formDataToSend)
    if (result.success) navigate('/login')
    setLoading(false)
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* BACKGROUND HERO */}
      <div className="relative min-h-[40vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={signupBg} alt="Signup Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#041837]/95 via-[#041837]/80 to-transparent" />
        </div>

        <div className="relative z-10 text-center px-6 animate-in fade-in slide-in-from-top-10 duration-1000">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-amber-500 rounded-2xl mb-4 md:mb-6 shadow-2xl">
            <HiIdentification className="h-6 w-6 md:h-8 md:h-8 text-[#041837]" />
          </div>
          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight mb-4">Tham gia cùng Hiểu Luật</h1>
          <p className="text-amber-500 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-[10px] md:text-xs">Cùng nhau kiến tạo giá trị pháp lý vững bền</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 -mt-16 md:-mt-24 relative z-20 pb-20">
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl md:rounded-[48px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden">

          {/* Account Type Selector */}
          <div className="grid grid-cols-2 p-2 md:p-3 bg-slate-50/50 m-4 md:m-8 rounded-2xl md:rounded-[32px] border border-slate-100">
            <button
              onClick={() => handleAccountTypeChange('client')}
              className={`flex flex-col items-center py-4 md:py-6 rounded-xl md:rounded-[28px] transition-all ${accountType === 'client' ? 'bg-[#041837] text-white shadow-2xl scale-[1.02]' : 'text-slate-400 hover:text-[#041837] hover:bg-white'}`}
            >
              <HiUser className={`h-6 w-6 md:h-7 md:w-7 mb-2 ${accountType === 'client' ? 'text-amber-500' : ''}`} />
              <span className="font-black uppercase tracking-widest text-[9px] md:text-[10px]">Khách hàng</span>
            </button>
            <button
              onClick={() => handleAccountTypeChange('lawyer')}
              className={`flex flex-col items-center py-4 md:py-6 rounded-xl md:rounded-[28px] transition-all ${accountType === 'lawyer' ? 'bg-[#041837] text-white shadow-2xl scale-[1.02]' : 'text-slate-400 hover:text-[#041837] hover:bg-white'}`}
            >
              <HiIdentification className={`h-6 w-6 md:h-7 md:w-7 mb-2 ${accountType === 'lawyer' ? 'text-amber-500' : ''}`} />
              <span className="font-black uppercase tracking-widest text-[9px] md:text-[10px]">Luật sư</span>
            </button>
          </div>

          <form className="px-6 md:px-20 pb-12 md:pb-16 space-y-6 md:space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#041837] uppercase tracking-[0.2em] ml-2">Họ và tên đầy đủ</label>
                <div className="relative group">
                  <input
                    name="fullName"
                    required
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] focus:ring-8 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-bold text-[#041837]"
                    placeholder="Nguyễn Văn A"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                </div>
                {errors.fullName && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#041837] uppercase tracking-[0.2em] ml-2">Địa chỉ Email</label>
                <div className="relative group">
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] focus:ring-8 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-bold text-[#041837]"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                </div>
                {errors.email && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.email}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-[#041837] uppercase tracking-[0.2em] ml-2">Số điện thoại</label>
                <div className="relative group">
                  <input
                    name="phone"
                    type="tel"
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] focus:ring-8 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-bold text-[#041837]"
                    placeholder="09xx xxx xxx"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#041837] uppercase tracking-[0.2em] ml-2">Mật khẩu</label>
                <div className="relative group">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] focus:ring-8 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-bold text-[#041837]"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500"
                  >
                    {showPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#041837] uppercase tracking-[0.2em] ml-2">Xác nhận mật khẩu</label>
                <div className="relative group">
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] focus:ring-8 focus:ring-amber-500/10 focus:border-amber-500 transition-all outline-none font-bold text-[#041837]"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <HiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-500"
                  >
                    {showConfirmPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Lawyer Section */}
            {accountType === 'lawyer' && (
              <div className="pt-8 md:pt-10 border-t border-slate-50 space-y-6 md:space-y-8 animate-in fade-in duration-500">
                <h3 className="text-xl md:text-2xl font-black text-[#041837] tracking-tight">Hồ sơ nghiệp vụ luật sư</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#041837] uppercase tracking-[0.2em] ml-2">Số thẻ luật sư</label>
                    <input
                      name="lawyer.barNumber"
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] focus:border-amber-500 transition-all outline-none font-bold"
                      placeholder="LS-00000"
                      value={formData.lawyerInfo.barNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#041837] uppercase tracking-[0.2em] ml-2">Văn phòng / Tổ chức</label>
                    <input
                      name="lawyer.lawFirm"
                      className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-[20px] focus:border-amber-500 transition-all outline-none font-bold"
                      placeholder="Tên đoàn luật sư / văn phòng"
                      value={formData.lawyerInfo.lawFirm}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#041837] uppercase tracking-[0.2em] ml-2">Năm kinh nghiệm</label>
                    <input
                      name="lawyer.yearsOfExperience"
                      type="number"
                      min="1"
                      max="60"
                      onKeyDown={(e) => ['-', 'e', '+'].includes(e.key) && e.preventDefault()}
                      className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-[20px] focus:border-amber-500 transition-all outline-none font-bold ${errors['lawyer.yearsOfExperience'] ? 'border-red-500' : 'border-slate-100'}`}
                      placeholder="Số năm thực chiến"
                      value={formData.lawyerInfo.yearsOfExperience}
                      onChange={handleChange}
                    />
                    {errors['lawyer.yearsOfExperience'] && <p className="text-red-500 text-[10px] font-bold ml-2">{errors['lawyer.yearsOfExperience']}</p>}
                  </div>
                  <div className="space-y-4 md:col-span-1">
                    <label className="text-[10px] font-black text-[#041837] uppercase tracking-[0.2em] ml-2">Phí mong muốn nhận được (VND)</label>
                    <input
                      name="lawyer.expectedSalary"
                      type="number"
                      min="100000"
                      step="10000"
                      onKeyDown={(e) => ['-', 'e', '+'].includes(e.key) && e.preventDefault()}
                      className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-[20px] focus:border-amber-500 transition-all outline-none font-bold ${errors['lawyer.expectedSalary'] ? 'border-red-500' : 'border-slate-100'}`}
                      placeholder="Mức phí bạn muốn nhận"
                      value={formData.lawyerInfo.expectedSalary}
                      onChange={handleChange}
                    />
                    {formData.lawyerInfo.expectedSalary > 0 && (
                      <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-500">PHÍ LUẬT SƯ:</span>
                          <span className="text-[#041837]">{Number(formData.lawyerInfo.expectedSalary).toLocaleString()}đ</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-slate-500">PHÍ HỆ THỐNG (15%):</span>
                          <span className="text-amber-600">{(Number(formData.lawyerInfo.expectedSalary) * 0.15).toLocaleString()}đ</span>
                        </div>
                        <div className="pt-2 border-t border-amber-200 flex justify-between text-[11px] font-black">
                          <span className="text-[#041837]">GIÁ HIỂN THỊ CHO KHÁCH:</span>
                          <span className="text-emerald-600">{(Number(formData.lawyerInfo.expectedSalary) * 1.15).toLocaleString()}đ</span>
                        </div>
                      </div>
                    )}
                    {errors['lawyer.expectedSalary'] && <p className="text-red-500 text-[10px] font-bold ml-2">{errors['lawyer.expectedSalary']}</p>}
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-[#041837] uppercase tracking-[0.2em] ml-2">Lĩnh vực chuyên môn doanh nghiệp</label>
                      <span className="text-[9px] font-bold text-slate-400">Chọn ít nhất một lĩnh vực</span>
                    </div>
                    <div className="flex flex-wrap gap-2 p-4 md:p-6 bg-slate-50/50 rounded-2xl md:rounded-[32px] border-2 border-slate-100">
                      {specialtiesList.map(item => {
                        const isSelected = formData.lawyerInfo.specialties?.includes(item);
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => handleSpecialtyToggle(item)}
                            className={`px-4 py-2.5 rounded-xl text-[10px] font-black tracking-widest transition-all duration-300 border-2 ${isSelected
                              ? 'bg-amber-500 border-amber-500 text-[#041837] shadow-lg shadow-amber-500/20 scale-105'
                              : 'bg-white border-slate-200 text-slate-400 hover:border-amber-500 hover:text-amber-500'
                              }`}
                          >
                            {item}
                          </button>
                        );
                      })}
                    </div>
                    {errors['lawyer.specialties'] && <p className="text-red-500 text-[10px] font-bold ml-2">{errors['lawyer.specialties']}</p>}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-[#041837] uppercase tracking-[0.2em] ml-2">Chứng chỉ hành nghề (PDF/Ảnh)</label>
                    <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-[20px] border border-blue-100">
                      <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                        <HiIdentification className="h-6 w-6" />
                      </div>
                      <input
                        type="file"
                        className="text-xs font-bold text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-[#041837] file:text-white hover:file:bg-black cursor-pointer"
                        onChange={(e) => setLicenseFile(e.target.files[0])}
                      />
                    </div>
                    {errors.licenseFile && <p className="text-red-500 text-[10px] font-bold ml-2">{errors.licenseFile}</p>}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-8">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-[#041837] hover:bg-black text-white font-black uppercase tracking-[0.2em] text-xs rounded-[28px] shadow-2xl shadow-blue-900/40 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? 'Đang khởi tạo tài khoản...' : 'Hoàn tất đăng ký'}
                {!loading && <HiArrowRight className="h-4 w-4" />}
              </button>
              <p className="text-center mt-8 text-slate-400 font-bold text-sm">
                Đã tham gia Hiểu Luật?{' '}
                <Link to="/login" className="text-amber-600 hover:text-amber-700">Đăng nhập ngay</Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      <PartnerSection />
      <CtaSection />
      <Footer />
    </div>
  )
}

export default Signup
