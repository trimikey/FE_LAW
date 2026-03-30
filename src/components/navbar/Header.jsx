// components/home/Header.jsx
import { useEffect, useState } from 'react'
import HomeNavbar from './HomeNavbar'

const Header = ({ isDashboard }) => {
  const [scrolled, setScrolled] = useState(false)
 
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
 
  return (
    <HeaderContainer>
      <HomeNavbar scrolled={scrolled} isDashboard={isDashboard} />
    </HeaderContainer>
  )
}

const HeaderContainer = ({ children }) => (
  <header className="fixed top-0 w-full z-50">
    {children}
  </header>
)

export default Header
