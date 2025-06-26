"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { useState, useEffect } from "react";
import "./globals.css";
import Navbar from "../app/components/navbar";
import Sidebar from "./components/sidebar";
import { usePathname } from "next/navigation";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname?.startsWith('/login') || false;
  const isBuyerFormPage = pathname?.startsWith('/buyer-form') || false;
  
  // Combined check for pages that should not have navigation
  const hideNavigation = isLoginPage || isBuyerFormPage;
  
  // State for responsive design
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Use useEffect to handle client-side operations only
  useEffect(() => {
    setMounted(true);
    
    // Check if viewport is mobile size
    const checkIsMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      
      // On larger screens, sidebar is always open by default
      // On mobile, sidebar is closed by default
      setIsSidebarOpen(!isMobileView);
    };
    
    // Initial check
    checkIsMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkIsMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // If not mounted yet, render a simple layout without client-specific features
  // This ensures server and client rendering match during hydration
  if (!mounted) {
    return (
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="overflow-x-hidden">
          {hideNavigation ? (
            <main className="w-full min-h-screen">
              {children}
            </main>
          ) : (
            <>
              <div className="h-[65px] flex justify-between items-center px-3 sm:px-5 md:px-[50px] bg-white border-b border-[#e0e0e0] fixed top-0 left-0 right-0 z-[1000] shadow-md">
                {/* Simplified navbar for server render */}
                <div className="flex items-center space-x-2">
                  <img
                    src="/LoomizLogoDarkBlue.svg"
                    alt="Loomiz Logo"
                    className="h-[36px] sm:h-[32px] md:h-[38px]"
                  />
                </div>
              </div>
              <main className="pt-[65px] px-4 sm:px-6 md:px-8 lg:px-10">
                {children}
              </main>
            </>
          )}
        </body>
      </html>
    );
  }
  
  // Default styles for navbar
  const navClasses = "h-[65px] flex justify-between items-center px-3 sm:px-5 md:px-[50px] bg-white border-b border-[#e0e0e0] fixed top-0 left-0 right-0 z-[1000] shadow-md";
  
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="overflow-x-hidden">
        {!hideNavigation && (
          <Navbar
            isMobile={isMobile}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        )}
        
        {!hideNavigation && (
          <Sidebar
            isMobile={isMobile}
            isOpen={isSidebarOpen}
            closeSidebar={() => isMobile && setIsSidebarOpen(false)}
          />
        )}
        
        {/* For login/buyer form pages - render with full width and no padding */}
        {hideNavigation ? (
          <main className="w-full min-h-screen">
            {children}
          </main>
        ) : (
          /* For dashboard pages - render with sidebar and padding */
          <main
            className={`
              pt-[65px] 
              transition-transform duration-300
              ${isMobile ? 'w-full' : 'ml-[290px]'} 
              px-4 sm:px-6 md:px-8 lg:px-10
            `}
            onClick={() => isMobile && isSidebarOpen && setIsSidebarOpen(false)}
          >
            {children}

          </main>
        )}
      </body>
    </html>
  );
}