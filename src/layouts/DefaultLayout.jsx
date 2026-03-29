import DefaultNavbar from "../components/navbar/DefaultNavbar"

const DefaultLayout = ({ children }) => {
  return (
    <>
      <DefaultNavbar />
      <main className="pt-20">
        {children}
      </main>
    </>
  )
}

export default DefaultLayout
