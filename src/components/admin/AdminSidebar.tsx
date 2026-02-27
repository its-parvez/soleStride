"use client";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  BarChart3,
  Truck,
  MessageSquare,
  CreditCard,
  ChevronLeft,
  Footprints,
  X,
} from "lucide-react";
import {  useState } from "react";
import Link from "next/link";
import SafeMotion from "@/wrappers/SafeMotion";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { authModalClose} from "@/redux/auth/AuthToggleSlice";


const AdminSidebar = () => {
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
    const sidebarOpen = useSelector((state: RootState) => state.authToggle.value);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin",
      badge: null,
    },
    {
      id: "products",
      label: "Products",
      icon: <ShoppingBag size={20} />,
      path: "/admin/products",
      badge: "12",
      submenu: [
        { label: "All Products", path: "/admin/products" },
        { label: "Add New", path: "/admin/products/new" },
        { label: "Categories", path: "/admin/products/categories" },
      ],
    },
    {
      id: "orders",
      label: "Orders",
      icon: <Package size={20} />,
      path: "/admin/orders",
      badge: "5",
      submenu: [
        { label: "All Orders", path: "/admin/orders" },
        { label: "Pending", path: "/admin/orders?status=pending" },
        { label: "Completed", path: "/admin/orders?status=completed" },
        { label: "Returns", path: "/admin/orders/returns" },
      ],
    },
    {
      id: "customers",
      label: "Customers",
      icon: <Users size={20} />,
      path: "/admin/customers",
      badge: "1.2K",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 size={20} />,
      path: "/admin/analytics",
    },
    {
      id: "shipping",
      label: "Shipping",
      icon: <Truck size={20} />,
      path: "/admin/shipping",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: <MessageSquare size={20} />,
      path: "/admin/reviews",
      badge: "24",
    },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCard size={20} />,
      path: "/admin/payments",
    },
  ];

  const toggleSubmenu = (itemId: string) => {
    setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
  };

 
  const sidebarContent = (
    <SafeMotion
      initial={false}
      animate={{
        width: collapsed ? 80 : 280,
      }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full  "
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Link href="/admin" className="flex items-center space-x-3">
          <div className="bg-gradient-to-br from-[#47B083] to-[#3A9E75] p-2 rounded-lg">
            <Footprints size={24} className="text-white" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col"
            >
              <span className="font-bold text-lg text-gray-900 dark:text-white">
                SoleStride
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Admin Panel
              </span>
            </motion.div>
          )}
        </Link>

        {/* Collapse Button - Desktop */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <ChevronLeft
            size={16}
            className={`text-gray-600 dark:text-gray-400 transition-transform duration-300 ${collapsed ? "rotate-180" : ""
              }`}
          />
        </button>

        {/* Close Button - Mobile */}
        <button
          onClick={() => dispatch(authModalClose())}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <X size={16} className="text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-2 px-3">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => {
                  if (item.submenu) {
                    toggleSubmenu(item.id);
                  } else {
                    dispatch(authModalClose())
                  }
                }}
                className={`w-full flex hover:cursor-pointer items-center ${collapsed ? "justify-center" : "justify-between"
                  } p-3 rounded-xl transition-all duration-200 group bg-[#47B083] dark:bg-gray-900 text-white 
                   
                `}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`text-gray-500 dark:text-gray-400  dark:group-hover:text-[#47B083]'
                  `}
                  >
                    {item.icon}
                  </div>
                  {!collapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                </div>

                {/* Badge and Submenu Indicator */}
                {!collapsed && (
                  <div className="flex items-center space-x-2">
                    {item.badge && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium 
                      
                          bg-white/20 text-white
                           
                      `}
                      >
                        {item.badge}
                      </span>
                    )}
                    {item.submenu && (
                      <ChevronLeft
                        size={16}
                        className={`transition-transform duration-200 ${activeSubmenu === item.id ? "rotate-90" : ""
                          }`}
                      />
                    )}
                  </div>
                )}
              </button>

              {/* Submenu */}
              {item.submenu && !collapsed && activeSubmenu === item.id && (
                <SafeMotion
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="ml-8 mt-1 space-y-1"
                >
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.label}
                      href={subItem.path}
                      className={`block py-2 px-3 rounded-lg text-sm transition-colors duration-200 ${true
                          ? "text-[#47B083] font-medium bg-[#47B083]/10"
                          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                      onClick={() => dispatch(authModalClose())}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </SafeMotion>
              )}
            </div>
          ))}
        </nav>
      </div>
    </SafeMotion>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">{sidebarContent}</div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <SafeMotion
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 lg:hidden"
          >
            {sidebarContent}
          </SafeMotion>
        )}
      </AnimatePresence>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 dark:bg-black/70 z-40 transition-opacity lg:hidden"
          onClick={() => dispatch(authModalClose())}
        ></div>
      )}
    </>
  );
};

export default AdminSidebar;
