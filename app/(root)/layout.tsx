import { Footer } from "@/modules/home/components/Footer";
import Navbar from "@/modules/home/components/Navbar";
import { ChildrenProps } from "@/types";

const RootLayout = ({children}: ChildrenProps) => {
  return (
    <main className="flex flex-col min-h-screen max-h-screen">
        {/* { Navbar } */}
        <Navbar />
        <div className="flex-1 flex flex-col px-4 pb-4">
            { children }
        </div>
        <Footer />
    </main>
  )
}

export default RootLayout;