

import "../../styles/global.css";
import ReduxProvider from "@/providers/ReduxProvider";
import { ToastProvider } from "@/providers/TostProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";;
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BackToTop from "@/components/modals/BackToTop";
import Footer from "@/components/Footer";
import { Poppins } from "next/font/google";
import TanstackQuery from "@/providers/TanstackQuery";



export const metadata: Metadata = {
  title: "soleStride",
  description: "soleStride shoe shop",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900']
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className={` ${poppins.className} bg-gray-50 dark:bg-gray-900  antialiased `}
      >
        
           <TanstackQuery>
            
          <ReduxProvider>
            <ToastProvider>
              <ThemeProvider>
                <nav>
                  <Navbar />
                </nav>
                <main className="mt-16">
                  {children}
                  <BackToTop />
                </main>
                <footer>
                  <Footer />
                </footer>


              </ThemeProvider>
            </ToastProvider>
          </ReduxProvider>
           </TanstackQuery>
       
      </body>
    </html>
  );
}
