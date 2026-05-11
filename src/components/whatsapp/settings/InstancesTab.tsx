import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { Server, Loader2 } from 'lucide-react'

export function InstancesTab() {
  const [instances, setInstances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const { toast } = useToast()

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('evolution_instances')
      .select('*')
      .order('created_at', { ascending: false })
    setInstances(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async () => {
    if (formData.id) {
      const { error } = await supabase
        .from('evolution_instances')
        .update({
          display_label: formData.display_label,
          owner_phone: formData.owner_phone,
          owner_name: formData.owner_name,
          is_default: formData.is_default,
        })
        .eq('id', formData.id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Instância atualizada' })
        setIsModalOpen(false)
        load()
      }
    } else {
      const { error } = await supabase.from('evolution_instances').insert({
        instance_name: formData.instance_name,
        base_url: formData.base_url || 'https://api.evolution.com',
        display_label: formData.display_label,
        owner_phone: formData.owner_phone,
        owner_name: formData.owner_name,
        is_default: formData.is_default || false,
      })
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Instância criada' })
        setIsModalOpen(false)
        load()
      }
    }
  }

  const handleDelete = async () => {
    if (!formData.id || !window.confirm('Tem certeza que deseja deletar?')) return
    const { error } = await supabase.from('evolution_instances').delete().eq('id', formData.id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Instância removida' })
      setIsModalOpen(false)
      load()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Instâncias Evolution</h2>
        <Button
          onClick={() => {
            setFormData({})
            setIsModalOpen(true)
          }}
        >
          Adicionar Instância
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Label</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Última Conexão</TableHead>
              <TableHead>Padrão</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : instances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  <Server className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Sem instâncias
                </TableCell>
              </TableRow>
            ) : (
              instances.map((inst) => (
                <TableRow
                  key={inst.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setFormData(inst)
                    setIsModalOpen(true)
                  }}
                >
                  <TableCell className="font-medium">{inst.instance_name}</TableCell>
                  <TableCell>{inst.display_label || '-'}</TableCell>
                  <TableCell>{inst.owner_phone || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={inst.status === 'connected' ? 'default' : 'secondary'}>
                      {inst.status || 'unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {inst.last_connected_at
                      ? format(new Date(inst.last_connected_at), 'dd/MM/yyyy HH:mm')
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {inst.is_default ? <Badge variant="outline">Sim</Badge> : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Detalhes da Instância' : 'Nova Instância'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Nome da Instância</Label>
              <Input
                disabled={!!formData.id}
                value={formData.instance_name || ''}
                onChange={(e) => setFormData({ ...formData, instance_name: e.target.value })}
              />
            </div>
            {!formData.id && (
              <div className="grid gap-2">
                <Label>Base URL</Label>
                <Input
                  value={formData.base_url || ''}
                  onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                  placeholder="https://api.evolution.com"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label>Label de Exibição</Label>
              <Input
                value={formData.display_label || ''}
                onChange={(e) => setFormData({ ...formData, display_label: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Telefone (Proprietário)</Label>
                <Input
                  value={formData.owner_phone || ''}
                  onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Nome (Proprietário)</Label>
                <Input
                  value={formData.owner_name || ''}
                  onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                checked={formData.is_default || false}
                onCheckedChange={(c) => setFormData({ ...formData, is_default: c })}
              />
              <Label>Instância Padrão</Label>
            </div>
          </div>
          <DialogFooter className="flex justify-between sm:justify-between w-full">
            {formData.id ? (
              <Button variant="destructive" onClick={handleDelete}>
                Deletar
              </Button>
            ) : (
              <div />
            )}
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>Salvar</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
