import "../../styles/global.css";
import ReduxProvider from "@/providers/ReduxProvider";
import { ToastProvider } from "@/providers/TostProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";;
import { Metadata } from "next";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import TanstackQuery from "@/providers/TanstackQuery";


export const metadata: Metadata = {
  title: "soleStride Admin",
  description: "soleStride admin panel",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {



  return (
    <html lang="en" suppressHydrationWarning >
      <body
        className="flex h-screen bg-gray-50 dark:bg-gray-900  antialiased max-w-[85rem] mx-auto"
      >

        <TanstackQuery>

        <ReduxProvider>
          <ToastProvider>
            <ThemeProvider>
              <AdminSidebar />

              {/* Main Content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <AdminNavbar />

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-4 md:p-6">

                  {children}

                </main>
              </div>
            </ThemeProvider>
          </ToastProvider>
        </ReduxProvider>
        </TanstackQuery>
      </body>
    </html>
  );
}
