import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  Settings,
  X,
  Image,
  FileText,
} from "lucide-react";

const Sidebar = ({ isOpen, onClose, currentPath }) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Products", href: "/products", icon: Package },
    { name: "Categories", href: "/categories", icon: FolderOpen },
    { name: "Banners", href: "/banners", icon: Image },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Users", href: "/users", icon: Users },
    { name: "Legal Content", href: "/legal", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            {/* Logo */}
            <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-600">
              <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
            </div>

            {/* Navigation */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => {
                  const isActive = currentPath === item.href;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={`
                        group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                        ${
                          isActive
                            ? "bg-primary-100 text-primary-900 border-r-2 border-primary-500"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }
                      `}
                    >
                      <item.icon
                        className={`
                          mr-3 flex-shrink-0 h-5 w-5 transition-colors
                          ${
                            isActive
                              ? "text-primary-500"
                              : "text-gray-400 group-hover:text-gray-500"
                          }
                        `}
                      />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 bg-primary-600">
            <h1 className="text-xl font-semibold text-white">Admin Panel</h1>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => {
                const isActive = currentPath === item.href;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={`
                      group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors
                      ${
                        isActive
                          ? "bg-primary-100 text-primary-900 border-r-2 border-primary-500"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        mr-3 flex-shrink-0 h-5 w-5 transition-colors
                        ${
                          isActive
                            ? "text-primary-500"
                            : "text-gray-400 group-hover:text-gray-500"
                        }
                      `}
                    />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
