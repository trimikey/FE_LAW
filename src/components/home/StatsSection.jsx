import { useEffect, useState } from 'react'
import { FaBriefcase, FaUser, FaBalanceScale } from 'react-icons/fa'
import statLawBg from '../../assets/anh-trai_luat.png'


const statsData = [
  {
    icon: <FaBriefcase />,
    value: 44,
    label: 'Luật sư / Công ty luật đã đăng ký'
  },
  {
    icon: <FaUser />,
    value: 15,
    label: 'Khách hàng đã đăng ký'
  },
  {
    icon: <FaBalanceScale />,
    value: 28,
    label: 'Vụ việc đã tiếp nhận'
  }
]

const Counter = ({ end }) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 1500 // ms
    const stepTime = Math.abs(Math.floor(duration / end))

    const timer = setInterval(() => {
      start += 1
      setCount(start)
      if (start === end) clearInterval(timer)
    }, stepTime)

    return () => clearInterval(timer)
  }, [end])

  return <span>{count}+</span>
}

const StatsSection = () => {
  return (
    <section
      className="stats-section"
      style={{ backgroundImage: `url(${statLawBg})` }}
    >
      <div className="overlay" />

      <div className="content">
        <h2>NHỮNG CON SỐ ĐÁNG CHÚ Ý</h2>
        <p>Cập nhật thường xuyên – minh bạch và tin cậy</p>

        <div className="stats-grid">
          {statsData.map((item, index) => (
            <div className="stat-card" key={index}>
              <div className="icon">{item.icon}</div>
              <h3><Counter end={item.value} /></h3>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
