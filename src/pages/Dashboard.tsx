import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Users, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const modules = [
    {
      title: 'WhatsApp',
      description: 'Gerencie conversas, contatos e instâncias conectadas.',
      icon: MessageSquare,
      path: '/whatsapp',
      color: 'text-[#00C9B1]',
      bg: 'bg-[#00C9B1]/10',
    },
    {
      title: 'CRM',
      description: 'Gestão de clientes e acompanhamento de contratos.',
      icon: Users,
      path: '/',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      title: 'Automações',
      description: 'Configuração de fluxos de mensagens e respostas.',
      icon: Zap,
      path: '/',
      color: 'text-[#FFB800]',
      bg: 'bg-[#FFB800]/10',
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Visão Geral</h1>
        <p className="text-muted-foreground mt-2">
          Bem-vindo ao Adapta Base. Escolha um módulo para começar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <Link to={mod.path} key={mod.title} className="block h-full">
            <Card className="hover:border-primary/50 transition-colors h-full flex flex-col bg-card border border-border shadow-none">
              <CardHeader>
                <div
                  className={`h-12 w-12 rounded-md flex items-center justify-center mb-4 ${mod.bg}`}
                >
                  <mod.icon className={`h-6 w-6 ${mod.color}`} />
                </div>
                <CardTitle className="font-heading text-xl">{mod.title}</CardTitle>
                <CardDescription className="text-muted-foreground mt-1">
                  {mod.description}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
