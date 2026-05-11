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
import { format } from 'date-fns'
import { Cpu, RefreshCw } from 'lucide-react'

export function AutomationLogTab() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  async function load() {
    setLoading(true)
    let q = supabase
      .from('automation_log')
      .select('*')
      .order('ran_at', { ascending: false })
      .limit(30)

    if (statusFilter === 'success') q = q.in('status', ['success', 'completed'])
    if (statusFilter === 'error') q = q.in('status', ['failed', 'error'])

    const { data } = await q
    setLogs(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [statusFilter])

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-border flex gap-4 items-center bg-card">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="success">Sucesso</SelectItem>
            <SelectItem value="error">Com Erro</SelectItem>
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
            <Cpu className="h-12 w-12 mb-4 opacity-20" /> Sem execuções registradas
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Play</TableHead>
                <TableHead>Executado em</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tokens</TableHead>
                <TableHead>Custo</TableHead>
                <TableHead>Latência</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow
                  key={log.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelected(log)}
                >
                  <TableCell className="font-medium">{log.play_name}</TableCell>
                  <TableCell>{format(new Date(log.ran_at), 'dd/MM/yyyy HH:mm:ss')}</TableCell>
                  <TableCell>
                    {log.status === 'success' || log.status === 'completed' ? (
                      <Badge className="bg-green-600 hover:bg-green-700">Sucesso</Badge>
                    ) : log.status === 'failed' || log.status === 'error' ? (
                      <Badge variant="destructive">Erro</Badge>
                    ) : (
                      <Badge variant="secondary">{log.status}</Badge>
                    )}
                  </TableCell>
                  <TableCell>{log.tokens_used || '-'}</TableCell>
                  <TableCell>
                    {log.cost_cents ? `R$ ${(log.cost_cents / 100).toFixed(2)}` : '-'}
                  </TableCell>
                  <TableCell>{log.latency_ms ? `${log.latency_ms}ms` : '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selected?.play_name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 bg-muted p-4 rounded-lg">
                <div>
                  <span className="text-xs text-muted-foreground block">Tokens</span>
                  <span className="font-medium">{selected.tokens_used || 0}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Custo</span>
                  <span className="font-medium">
                    R$ {((selected.cost_cents || 0) / 100).toFixed(4)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Latência</span>
                  <span className="font-medium">{selected.latency_ms || 0}ms</span>
                </div>
              </div>

              {selected.error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-md text-sm">
                  <span className="font-bold block mb-1">Erro:</span>
                  {selected.error}
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-2">Output</h4>
                <ScrollArea className="h-[150px] w-full rounded-md border bg-muted p-4">
                  <pre className="text-xs">{JSON.stringify(selected.output, null, 2)}</pre>
                </ScrollArea>
              </div>

              {selected.context_jsonb && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Context</h4>
                  <ScrollArea className="h-[150px] w-full rounded-md border bg-muted p-4">
                    <pre className="text-xs">{JSON.stringify(selected.context_jsonb, null, 2)}</pre>
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setSelected(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
