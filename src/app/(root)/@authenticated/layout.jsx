import { Navbar } from "@/components/navbar"

function Layout({ children }) {
  return (
    <>
        <Navbar />
        <main>
            { children }
        </main>
    </>
  )
}
export default Layout