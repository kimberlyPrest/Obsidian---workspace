import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Plus, Settings2, RefreshCw } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { InstanceModal } from '@/components/whatsapp-config/InstanceModal'

export function InstancesTab() {
  const [instances, setInstances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedInstance, setSelectedInstance] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchInstances = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('evolution_instances')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setInstances(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstances()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Instâncias Evolution</h2>
        <Button
          onClick={() => {
            setSelectedInstance(null)
            setModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Instância
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-lg">
          <p>{error}</p>
          <Button variant="outline" onClick={fetchInstances} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" /> Tentar Novamente
          </Button>
        </div>
      ) : instances.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground border rounded-lg bg-card/50">
          <Settings2 className="h-8 w-8 mx-auto mb-4 opacity-50" />
          <p>Nenhuma instância encontrada</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {instances.map((inst) => (
            <div
              key={inst.id}
              className="p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors cursor-pointer flex justify-between items-center"
              onClick={() => {
                setSelectedInstance(inst)
                setModalOpen(true)
              }}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-lg">
                    {inst.display_label || inst.instance_name}
                  </h3>
                  {inst.is_default && <Badge variant="secondary">Padrão</Badge>}
                  <Badge variant={inst.status === 'connected' ? 'default' : 'secondary'}>
                    {inst.status || 'unknown'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {inst.owner_phone && <span>Owner: {inst.owner_phone} • </span>}
                  {inst.last_connected_at && (
                    <span>
                      Conectado em:{' '}
                      {format(new Date(inst.last_connected_at), 'dd/MM/yyyy HH:mm', {
                        locale: ptBR,
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <InstanceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        instance={selectedInstance}
        onSuccess={fetchInstances}
      />
    </div>
  )
}
