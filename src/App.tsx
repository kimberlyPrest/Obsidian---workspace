import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider, useAuth } from '@/hooks/use-auth'
import { Layout } from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/Login'
import WhatsAppModule from '@/pages/WhatsApp'
import WhatsAppSuggestions from '@/pages/WhatsAppSuggestions'
import WhatsAppQueue from '@/pages/WhatsAppQueue'
import WhatsAppLogs from '@/pages/WhatsAppLogs'
import WhatsAppSettings from '@/pages/WhatsAppSettings'
import NotFound from '@/pages/NotFound'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
        Carregando...
      </div>
    )
  if (!session) return <Navigate to="/login" replace />
  return <>{children}</>
}

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/whatsapp" element={<WhatsAppModule />} />
            <Route path="/whatsapp/suggestions" element={<WhatsAppSuggestions />} />
            <Route path="/whatsapp/queue" element={<WhatsAppQueue />} />
            <Route path="/whatsapp/logs" element={<WhatsAppLogs />} />
            <Route path="/whatsapp/config" element={<WhatsAppSettings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </BrowserRouter>
)

export default App
