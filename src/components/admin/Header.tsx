import { Bell, Search, Menu, Sun, Moon } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useState, useEffect } from 'react'
import { toggleTheme } from "@/hooks/theme.ts"

interface HeaderProps {
  toggleSidebar?: () => void
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [isDark, setIsDark] = useState(false)

 
  return (
    <header className="bg-white rounded-3xl shadow-sm px-6 h-20 flex items-center">
      <div className="w-full flex items-center justify-between gap-4">

        {/* Left Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          {toggleSidebar && (
            <Button 
              variant="ghost" 
              size="icon"
              className="sm:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          <h2 className="text-lg font-normal sm:hidden text-foreground">
            Admin
          </h2>
        </div>

        {/* Search - Desktop */}
        <div className="hidden sm:block flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-10 h-12 text-base rounded-md border-slate-300"
            />
          </div>
        </div>

        {/* Mobile Search Toggle */}
        <Button 
          variant="ghost" 
          size="icon"
          className="sm:hidden"
          onClick={() => setShowMobileSearch(!showMobileSearch)}
        >
          <Search className="w-5 h-5" />
        </Button>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-3">

          {/* 🌙 Dark Mode Toggle */}
          <Button
  variant="ghost"
  size="icon"
  onClick={toggleTheme}
  className="rounded-md"
>
  🌙
</Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
          </Button>
          
          {/* Profile - Desktop */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
              A
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">Admin</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
          </div>
          
          {/* Profile - Mobile */}
          <div className="sm:hidden w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
            A
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {showMobileSearch && (
        <div className="sm:hidden mt-3 pt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-9 h-10 text-sm"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  )
}

export default Header