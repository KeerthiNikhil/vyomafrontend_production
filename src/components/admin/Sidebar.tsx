import { NavLink } from 'react-router-dom'
import {
  Home,
  Image,
  Star,
  CreditCard,
  Users,
  LogOut,
  X
} from 'lucide-react'
import { Button } from '../ui/button'

interface SidebarProps {
  closeSidebar?: () => void
}

const Sidebar = ({ closeSidebar }: SidebarProps) => {
  
  const navItems = [
    { to: 'dashboard', icon: Home, label: 'Dashboard' },
    { to: 'banners', icon: Image, label: 'Banners' },
    { to: 'reviews', icon: Star, label: 'Reviews' },
    { to: 'payments', icon: CreditCard, label: 'Payments' },
    { to: 'vendors', icon: Users, label: 'Vendors' },
  ]

  const handleNavClick = () => {
    closeSidebar?.()
  }

  const handleLogout = () => {
  localStorage.removeItem("token")
  window.location.href = "/admin/login"
}

  return (
    <div className="w-72 bg-white rounded-[28px] shadow-sm text-foreground flex flex-col h-full">
      
      {/* Logo */}
      <div className="px-6 pt-7 pb-5 relative">
       
          <div className="flex items-center gap-3">
            <img 
              src="/logo-for-web-blue.png" 
              alt="VYOMA Logo" 
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-xl font-bold text-primary">
              VYOMA
            </h1>
          </div>
        

        {closeSidebar && (
          <Button 
            variant="ghost" 
            size="icon"
            className="absolute top-4 right-4 sm:hidden"
            onClick={closeSidebar}
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={handleNavClick}
           className={({ isActive }) =>
  `flex items-center px-3 py-1.5 h-9 rounded-md text-sm ${
    isActive
      ? 'bg-slate-900 text-white'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  }`
}
          >
            <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Logout */}
      <div className="p-4 mt-auto">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="flex items-center justify-start w-full h-auto px-3 sm:px-4 py-2.5 sm:py-3 text-muted-foreground hover:bg-muted hover:text-foreground text-sm sm:text-base"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  )
}

export default Sidebar