import Navbar from "@/modules/home/components/Navbar";
import { RootLayoutProp } from "@/types";

const RootLayout = ({children}: RootLayoutProp) => {
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
        {/* { Navbar } */}
        <Navbar userRole={"ADMIN"}/>
        <div className="flex-1 flex flex-col px-4 pb-4">
            { children }
        </div>
    </main>
  )
}

export default RootLayout;