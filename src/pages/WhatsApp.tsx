import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Phone, CheckCircle2, XCircle, Users } from 'lucide-react'

interface Instance {
  id: string
  instance_name: string
  status: string
  last_connected_at: string
}

interface Contact {
  id: string
  remote_jid: string
  push_name: string
  phone_number: string
}

export default function WhatsAppModule() {
  const [instances, setInstances] = useState<Instance[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [{ data: instData }, { data: contData }] = await Promise.all([
        supabase.from('evolution_instances').select('*').limit(5),
        supabase
          .from('whatsapp_contacts')
          .select('*')
          .order('last_message_at', { ascending: false })
          .limit(5),
      ])
      if (instData) setInstances(instData as any)
      if (contData) setContacts(contData as any)
      setLoading(false)
    }
    fetchData()
  }, [])

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Módulo WhatsApp</h1>
        <p className="text-muted-foreground mt-2">
          Acompanhamento e controle de instâncias Evolution e seus contatos recentes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border shadow-none">
          <CardHeader>
            <CardTitle className="font-heading flex items-center text-lg">
              <Phone className="mr-2 h-5 w-5 text-primary" />
              Instâncias Evolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Carregando instâncias...</p>
            ) : instances.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma instância configurada.</p>
            ) : (
              <div className="space-y-4">
                {instances.map((inst) => (
                  <div
                    key={inst.id}
                    className="flex items-center justify-between p-4 bg-card-secondary rounded-md border border-border"
                  >
                    <div>
                      <p className="font-medium text-foreground">{inst.instance_name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Última conexão:{' '}
                        {inst.last_connected_at
                          ? new Date(inst.last_connected_at).toLocaleDateString()
                          : 'Nunca'}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        inst.status === 'connected'
                          ? 'bg-success/10 text-success border-success/20 font-medium'
                          : 'bg-destructive/10 text-destructive border-destructive/20 font-medium'
                      }
                    >
                      {inst.status === 'connected' ? (
                        <CheckCircle2 className="h-3 w-3 mr-1.5" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1.5" />
                      )}
                      {inst.status === 'connected' ? 'Conectado' : 'Desconectado'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-none">
          <CardHeader>
            <CardTitle className="font-heading flex items-center text-lg">
              <Users className="mr-2 h-5 w-5 text-accent" />
              Últimos Contatos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Carregando contatos...</p>
            ) : (
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader className="bg-card-secondary">
                    <TableRow className="border-border hover:bg-transparent">
                      <TableHead className="text-muted-foreground font-medium">Nome</TableHead>
                      <TableHead className="text-muted-foreground font-medium">Telefone</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.length === 0 ? (
                      <TableRow className="border-border">
                        <TableCell colSpan={2} className="text-center text-muted-foreground py-6">
                          Nenhum contato encontrado.
                        </TableCell>
                      </TableRow>
                    ) : (
                      contacts.map((c) => (
                        <TableRow
                          key={c.id}
                          className="border-border hover:bg-card-secondary transition-colors"
                        >
                          <TableCell className="font-medium text-foreground">
                            {c.push_name || 'Desconhecido'}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {c.phone_number || c.remote_jid}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
