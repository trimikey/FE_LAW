import { useLocation } from 'react-router-dom';
import Header from "../components/navbar/Header"

const HomeLayout = ({ children }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/cases');

  return (
    <>
      <Header />
      <main className={isDashboard ? "pt-0" : "pt-[104px]"}>
        {children}
      </main>
    </>
  )
}

export default HomeLayout
