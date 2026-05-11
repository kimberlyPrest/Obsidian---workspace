import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import { Zap } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('kimberly@adapta.org')
  const [password, setPassword] = useState('Skip@Pass')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    const { error } = await signIn(email, password)
    setLoading(false)
    if (!error) {
      navigate('/')
    } else {
      setErrorMsg(error.message)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in-up">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full mb-4 border border-primary/20">
            <Zap className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground tracking-tight">
            Adapta Base
          </h1>
          <p className="text-muted-foreground mt-2">Acesse seu painel modular.</p>
        </div>

        <Card className="bg-card border-border shadow-none">
          <CardContent className="pt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input/50 border-border text-foreground focus-visible:ring-primary"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Senha</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input/50 border-border text-foreground focus-visible:ring-primary"
                  required
                />
              </div>
              {errorMsg && <p className="text-sm text-destructive">{errorMsg}</p>}
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-md h-11"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
