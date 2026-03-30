import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from "../components/navbar/Header"

const HomeLayout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/cases');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className={isDashboard ? "hidden lg:block" : "block"}>
        <Header isDashboard={isDashboard} />
      </div>
      <main 
        className="transition-all duration-300"
        style={{ 
          paddingTop: typeof window !== 'undefined' && window.innerWidth < 1024 
            ? (isDashboard ? '70px' : '116px') 
            : (scrolled ? '64px' : '116px') 
        }}
      >
        {children}
      </main>
    </>
  );
};

export default HomeLayout;
