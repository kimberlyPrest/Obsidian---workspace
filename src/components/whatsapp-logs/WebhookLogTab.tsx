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
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Copy, RefreshCw, Trash, FileJson } from 'lucide-react'

export function WebhookLogTab() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { toast } = useToast()

  async function load() {
    setLoading(true)
    let q = supabase
      .from('evolution_webhook_log')
      .select('*')
      .order('received_at', { ascending: false })
      .limit(30)

    if (statusFilter === 'processed') q = q.eq('processed', true).is('error', null)
    if (statusFilter === 'error') q = q.not('error', 'is', null)
    if (statusFilter === 'pending') q = q.eq('processed', false).is('error', null)

    const { data } = await q
    setLogs(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [statusFilter])

  async function handleDelete(id: string) {
    await supabase.from('evolution_webhook_log').delete().eq('id', id)
    toast({ title: 'Log deletado' })
    setSelected(null)
    load()
  }

  async function handleReprocess(log: any) {
    toast({ title: 'Reprocessando...' })
    await supabase
      .from('evolution_webhook_log')
      .update({ processed: true, error: null })
      .eq('id', log.id)
    setSelected(null)
    load()
  }

  function copyPayload(payload: any) {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2))
    toast({ title: 'Copiado para a área de transferência' })
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-border flex gap-4 items-center bg-card">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="processed">Processado</SelectItem>
            <SelectItem value="error">Com Erro</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" onClick={load}>
          <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
        </Button>
      </div>

      <div className="overflow-auto flex-1">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Carregando...</div>
        ) : !logs.length ? (
          <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
            <FileJson className="h-12 w-12 mb-4 opacity-20" /> Sem eventos registrados
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Evento</TableHead>
                <TableHead>Recebido em</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Preview</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelected(log)}
                >
                  <TableCell className="font-medium">{log.evolution_event}</TableCell>
                  <TableCell>{format(new Date(log.received_at), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  <TableCell>
                    {log.error ? (
                      <Badge variant="destructive">Erro</Badge>
                    ) : log.processed ? (
                      <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                        Processado
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Pendente</Badge>
                    )}
                  </TableCell>
                  <TableCell className="truncate max-w-[200px] text-muted-foreground">
                    {JSON.stringify(log.payload).substring(0, 50)}...
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelected(log)
                      }}
                    >
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center pr-4">
              <span>{selected?.evolution_event}</span>
              <span className="text-xs font-normal text-muted-foreground">
                {selected && format(new Date(selected.received_at), 'dd/MM/yyyy HH:mm:ss')}
              </span>
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Processado:</span>
                  <p className="font-medium">{selected.processed ? 'Sim' : 'Não'}</p>
                </div>
                {selected.error && (
                  <div>
                    <span className="text-sm text-muted-foreground">Erro:</span>
                    <p className="font-medium text-destructive">{selected.error}</p>
                  </div>
                )}
              </div>
              <div className="relative">
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-2 h-8 w-8 z-10"
                  onClick={() => copyPayload(selected.payload)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <ScrollArea className="h-[300px] w-full rounded-md border bg-muted p-4">
                  <pre className="text-xs">{JSON.stringify(selected.payload, null, 2)}</pre>
                </ScrollArea>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-between items-center w-full">
            <Button variant="destructive" onClick={() => handleDelete(selected?.id)}>
              <Trash className="h-4 w-4 mr-2" /> Deletar
            </Button>
            <div className="flex gap-2">
              {selected?.error && (
                <Button variant="outline" onClick={() => handleReprocess(selected)}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Reprocessar
                </Button>
              )}
              <Button variant="default" onClick={() => setSelected(null)}>
                Fechar
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
