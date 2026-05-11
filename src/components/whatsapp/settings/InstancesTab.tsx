import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Loader2, Plus, ServerCrash, RefreshCcw } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { InstanceModal } from './InstanceModal'

export function InstancesTab() {
  const [instances, setInstances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedInstance, setSelectedInstance] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('evolution_instances')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) setError(error.message)
    else setInstances(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleEdit = (instance: any) => {
    setSelectedInstance(instance)
    setIsModalOpen(true)
  }
  const handleCreate = () => {
    setSelectedInstance(null)
    setIsModalOpen(true)
  }

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  if (error)
    return (
      <div className="text-center p-12 text-destructive">
        <ServerCrash className="h-8 w-8 mx-auto mb-3" />
        <p>{error}</p>
        <Button variant="outline" onClick={loadData} className="mt-4">
          <RefreshCcw className="w-4 h-4 mr-2" /> Tentar Novamente
        </Button>
      </div>
    )

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Suas Instâncias Evolution</h2>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> Adicionar Instância
        </Button>
      </div>

      {!instances.length ? (
        <div className="text-center p-12 bg-muted/30 rounded-lg border border-dashed">
          <p className="text-muted-foreground mb-4">Nenhuma instância cadastrada ainda.</p>
          <Button onClick={handleCreate} variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Adicionar Instância
          </Button>
        </div>
      ) : (
        <div className="border rounded-md bg-background overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Nome da Instância</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Telefone Resp.</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Última Conexão</TableHead>
                <TableHead>Padrão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instances.map((inst) => (
                <TableRow
                  key={inst.id}
                  onClick={() => handleEdit(inst)}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium text-primary">{inst.instance_name}</TableCell>
                  <TableCell>{inst.display_label || '-'}</TableCell>
                  <TableCell>{inst.owner_phone || '-'}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        inst.status === 'connected'
                          ? 'default'
                          : inst.status === 'open'
                            ? 'default'
                            : 'secondary'
                      }
                      className="capitalize"
                    >
                      {inst.status || 'unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {inst.last_connected_at
                      ? format(new Date(inst.last_connected_at), "dd/MM/yy 'às' HH:mm", {
                          locale: ptBR,
                        })
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {inst.is_default && (
                      <Badge
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        Sim
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <InstanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        instance={selectedInstance}
        onSaved={loadData}
      />
    </div>
  )
}
