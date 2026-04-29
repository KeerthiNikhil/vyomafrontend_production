import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/admin/Sidebar'
import Header from '@/components/admin/Header'
import { useState, useEffect } from 'react'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex h-screen">

        {/* overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* SIDEBAR BOX */}
        <div
          className={`
            ${
              isMobile
                ? `fixed inset-y-4 left-4 z-50 transform transition-transform duration-300
                   ${
                     sidebarOpen
                       ? "translate-x-0"
                       : "-translate-x-full"
                   }`
                : "w-72 shrink-0"
            }
          `}
        >
          <Sidebar
            closeSidebar={() => setSidebarOpen(false)}
          />
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex flex-col overflow-hidden">

        <div className="p-5 pb-0">
  <Header
    toggleSidebar={() =>
      setSidebarOpen(!sidebarOpen)
    }
  />
</div>

          {/* CONTENT BOX */}
          <main className="flex-1 bg-white rounded-[28px] shadow-sm overflow-y-auto p-8 m-5 mt-4">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
};

export default AdminLayout;