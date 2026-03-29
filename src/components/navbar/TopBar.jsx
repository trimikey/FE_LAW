import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaTiktok
} from 'react-icons/fa'
import { SiZalo } from 'react-icons/si'

const TopBar = () => {
  return (
    <div className="bg-gradient-to-r from-[#0f2f4f] to-[#123a63] text-slate-200 text-sm">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-11">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-yellow-400 text-xs" />
            <span className="font-medium tracking-wide">0345 142 309</span>
          </div>

          <div className="flex items-center gap-2">
            <FaEnvelope className="text-yellow-400 text-xs" />
            <span className="font-medium tracking-wide">HieuLuat@gmail.com</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="h-7 w-44 pl-3 pr-8 rounded-md bg-white/90 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          </div>

          <div className="flex items-center gap-3 text-slate-300">
            <a className="hover:text-yellow-400 transition" href="https://www.facebook.com/"><FaFacebookF /></a>
            <a className="hover:text-yellow-400 transition" href="https://www.instagram.com/"><FaInstagram /></a>
            <a className="hover:text-yellow-400 transition" href="https://www.tiktok.com/"><FaTiktok /></a>
            <a className="hover:text-yellow-400 transition" href="https://zalo.me/pc"><SiZalo /></a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
