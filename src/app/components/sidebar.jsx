'use client';
import React from 'react';
import { useRouter, usePathname } from 'next/navigation'; // App Router imports

const Sidebar = ({ isMobile, isOpen, closeSidebar }) => {
  const router = useRouter(); // Initialize router
  const pathname = usePathname() || '/'; // Provide default value for SSR

  const mainItems = [
    { label: 'OVERVIEW', icon: '/SidebarOverviewLogo.svg', route: '/' },
    { label: 'REQUEST FOR QUOTE', icon: '/SidebarRFQLogo.svg', route: '/rfq' },
    { label: 'ORDER TRACKING', icon: '/SidebarOrderTrackingLogo.svg', route: '/ordertracking' },
    { label: 'PAYMENT', icon: '/SidebarPaymentLogo.svg', route: '/payment' },
    { label: 'CHATS', icon: '/SidebarChatsLogo.svg', route: '/Chats' },
    // { label: 'ORDER HISTORY', icon: '/SidebarOrderHistoryLogo.svg', route: '/order-history' },
    { label: 'CATALOGUES', icon: '/SidebarOrderHistoryLogo.svg', route: 'https://ecomloomiz.vercel.app/' },
  ];
  
  const bottomItems = [
    { label: 'SETTINGS', icon: '/SidebarSettingsLogo.svg', route: '/settings' },
    { label: 'ACCOUNT', icon: '/SidebarAccountLogo.svg', route: '/account' },
  ];

  // Handle navigation
  const handleNavigation = (route) => {
    router.push(route);
    if (isMobile) closeSidebar();
  };

  // Simplified sidebar classes
  const sidebarClasses = `
    fixed top-[65px] left-0 
    h-[calc(100vh-65px)]
    bg-[#EDF5FF] p-5
    flex flex-col justify-start
    transition-transform duration-300 ease-in-out z-40
    w-[290px]
    ${isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'}
  `;

  return (
    <>
      {/* Overlay - only visible on mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={sidebarClasses}>
        <div className="text-[24px] mb-5 text-black font-[NSmedium] px-5 pt-5 font-variant-small-caps">
          DASHBOARD
        </div>
        
        <div className="flex-1 flex flex-col justify-between">
          {/* Top Menu */}
          <ul className="list-none px-3 m-0">
            {mainItems.map((item, index) => {
              // Check if current path matches this item's route
              // For home route, check exact match, for others check if path starts with route
              const isActive = item.route === '/' 
                ? pathname === '/' 
                : pathname?.startsWith(item.route);
                
              return (
                <li
                  key={index}
                  className={`flex items-center py-3 px-2 cursor-pointer text-[16px] text-[#222] font-[NSregular] hover:bg-[#dbe9ff] rounded-md transition font-variant-small-caps ${
                    isActive ? 'bg-[#dbe9ff]' : ''
                  }`}
                  onClick={() => handleNavigation(item.route)}
                >
                  <img src={item.icon} alt={`${item.label} icon`} className="w-[25px] h-[25px] mr-3" />
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
          
          {/* Bottom Menu */}
          <ul className="list-none px-3 m-0 mb-2">
            {bottomItems.map((item, index) => {
              // Check if current path matches this item's route
              const isActive = item.route === '/' 
                ? pathname === '/' 
                : pathname?.startsWith(item.route);
                
              return (
                <li
                  key={index}
                  className={`flex items-center py-3 px-2 cursor-pointer text-[16px] text-[#222] font-[NSregular] hover:bg-[#dbe9ff] rounded-md transition font-variant-small-caps ${
                    isActive ? 'bg-[#dbe9ff]' : ''
                  }`}
                  onClick={() => handleNavigation(item.route)}
                >
                  <img src={item.icon} alt={`${item.label} icon`} className="w-[25px] h-[25px] mr-3" />
                  <span>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;