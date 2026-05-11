import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { Clock } from 'lucide-react'

export function ResponseMetricsTab() {
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('whatsapp_response_metrics')
      .select('*, contact:whatsapp_contacts(push_name, phone_number)')
      .order('inbound_at', { ascending: false })
      .limit(30)
    setMetrics(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  if (loading) return <div className="p-8 text-center text-muted-foreground">Carregando...</div>
  if (!metrics.length)
    return (
      <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
        <Clock className="h-12 w-12 mb-4 opacity-20" /> Sem métricas registradas
      </div>
    )

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full">
      <div className="overflow-auto flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contato</TableHead>
              <TableHead>Recebida em</TableHead>
              <TableHead>Respondida em</TableHead>
              <TableHead className="text-right">Tempo Bruto</TableHead>
              <TableHead className="text-right">Tempo Útil</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">
                  {m.contact?.push_name || m.contact?.phone_number || m.remote_jid}
                </TableCell>
                <TableCell>{format(new Date(m.inbound_at), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                <TableCell>
                  {m.outbound_at ? format(new Date(m.outbound_at), 'dd/MM/yyyy HH:mm:ss') : '-'}
                </TableCell>
                <TableCell className="text-right">
                  {m.raw_minutes ? `${Math.round(m.raw_minutes)}m` : '-'}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {m.business_hours_minutes ? `${Math.round(m.business_hours_minutes)}m` : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
