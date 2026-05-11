import { Outlet, Link, useLocation } from 'react-router-dom'
import { Home, MessageSquare, LogOut, LayoutDashboard, Zap } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function Layout() {
  const { signOut } = useAuth()
  const location = useLocation()

  const navItems = [
    { name: 'Visão Geral', path: '/', icon: LayoutDashboard },
    { name: 'WhatsApp', path: '/whatsapp', icon: MessageSquare },
  ]

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="w-64 bg-card border-r border-border flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-border space-x-3">
          <div className="bg-primary/10 p-1.5 rounded-md border border-primary/20">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <h1 className="font-heading text-lg font-bold text-foreground">Adapta Base</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}>
                <span
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2.5 rounded-md transition-colors font-medium text-sm',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-card-secondary hover:text-foreground',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-card-secondary"
            onClick={() => signOut()}
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sair
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto bg-background p-8">
        <Outlet />
      </main>
    </div>
  )
}
