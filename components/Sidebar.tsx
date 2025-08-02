'use client'

import React, { useEffect } from 'react'
import { LogOut, TrendingUp, Users, Gift, Wallet, X, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, usePathname } from 'next/navigation'

interface SidebarProps {
  isSidebarOpen: boolean
  activeTab: string
  setActiveTab: (tab: string) => void
  handleLogout: () => void
  toggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  handleLogout,
  isSidebarOpen,
  toggleSidebar,
}) => {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { id: 'dashboard', icon: TrendingUp, label: 'Dashboard', path: '/lazrchain-dashboard' },
    { id: 'referral', icon: Users, label: 'Referral Program', path: '/lazrchain-referral-program' },
    { id: 'rewards', icon: Gift, label: 'Rewards', path: '/lazrchain-rewards' },
    { id: 'wallet', icon: Wallet, label: 'Wallet', path: '/lazrchain-wallet' },
    { id: 'settings', icon: Settings, label: 'Settings', path: '/lazrchain-settings' },
    ]

  // Sync active tab with URL path on first load
  useEffect(() => {
    const matched = navItems.find(item => item.path === pathname)
    if (matched && matched.id !== activeTab) {
      setActiveTab(matched.id)
    }
  }, [pathname])

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-card shadow-xl z-20 transform transition-transform duration-300 ease-in-out lg:static lg:transform-none lg:flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 border-b bg-gradient-primary">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-foreground rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-lg">L</span>
              </div>
              <span className="text-lg font-bold text-primary-foreground truncate">LazrChain</span>
            </div>
            <Button
              variant="ghost"
              className="lg:hidden text-primary-foreground p-2 hover:bg-white/10"
              onClick={toggleSidebar}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <nav className="mt-4 flex-1 px-2">
          <div className="space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  router.push(item.path)
                  toggleSidebar()
                }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200 text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-gradient-primary text-primary-foreground shadow-md'
                    : 'text-card-foreground hover:bg-muted hover:scale-[1.02] active:scale-100'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="p-2 border-t">
          <Button
            onClick={() => {
              handleLogout();
            }}
            variant="outline"
            className="w-full flex items-center space-x-2 text-sm font-medium hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-colors py-3"
          >
            <LogOut className="w-4 h-4" />
            <span className="truncate">Logout</span>
          </Button>
        </div>
      </div>

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  )
}

export default Sidebar
