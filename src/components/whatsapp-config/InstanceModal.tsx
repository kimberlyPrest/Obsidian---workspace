import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { format } from 'date-fns'

export function InstanceModal({ open, onOpenChange, instance, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    instance_name: '',
    display_label: '',
    base_url: '',
    api_key_hint: '',
    owner_phone: '',
    owner_name: '',
    is_default: false,
  })

  useEffect(() => {
    if (instance) {
      setFormData({
        instance_name: instance.instance_name || '',
        display_label: instance.display_label || '',
        base_url: instance.base_url || '',
        api_key_hint: instance.api_key_hint || '',
        owner_phone: instance.owner_phone || '',
        owner_name: instance.owner_name || '',
        is_default: instance.is_default || false,
      })
    } else {
      setFormData({
        instance_name: '',
        display_label: '',
        base_url: '',
        api_key_hint: '',
        owner_phone: '',
        owner_name: '',
        is_default: false,
      })
    }
  }, [instance, open])

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = { ...formData }
      if (instance) {
        const { error } = await supabase
          .from('evolution_instances')
          .update(payload)
          .eq('id', instance.id)
        if (error) throw error
        toast.success('Instância atualizada com sucesso')
      } else {
        const { error } = await supabase.from('evolution_instances').insert([payload])
        if (error) throw error
        toast.success('Instância criada com sucesso')
      }
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja deletar esta instância?')) return
    setLoading(true)
    try {
      const { error } = await supabase.from('evolution_instances').delete().eq('id', instance.id)
      if (error) throw error
      toast.success('Instância deletada com sucesso')
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{instance ? 'Detalhes da Instância' : 'Nova Instância'}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>Instance Name</Label>
            <Input
              value={formData.instance_name}
              onChange={(e) => setFormData({ ...formData, instance_name: e.target.value })}
              disabled={!!instance}
            />
          </div>
          <div className="space-y-2">
            <Label>Base URL</Label>
            <Input
              value={formData.base_url}
              onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
              disabled={!!instance}
            />
          </div>
          <div className="space-y-2">
            <Label>Display Label</Label>
            <Input
              value={formData.display_label}
              onChange={(e) => setFormData({ ...formData, display_label: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>API Key Hint</Label>
            <Input
              value={formData.api_key_hint}
              onChange={(e) => setFormData({ ...formData, api_key_hint: e.target.value })}
              disabled={!!instance}
            />
          </div>
          <div className="space-y-2">
            <Label>Owner Phone</Label>
            <Input
              value={formData.owner_phone}
              onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Owner Name</Label>
            <Input
              value={formData.owner_name}
              onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
            />
          </div>
          <div className="flex items-center space-x-2 pt-8">
            <Switch
              checked={formData.is_default}
              onCheckedChange={(c) => setFormData({ ...formData, is_default: c })}
            />
            <Label>Instância Padrão</Label>
          </div>
        </div>
        {instance && (
          <div className="bg-card-secondary p-4 rounded-md space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Status:</span>
              <Badge variant={instance.status === 'connected' ? 'default' : 'secondary'}>
                {instance.status || 'unknown'}
              </Badge>
            </div>
            {instance.last_connected_at && (
              <div className="text-sm text-muted-foreground">
                Última conexão: {format(new Date(instance.last_connected_at), 'dd/MM/yyyy HH:mm')}
              </div>
            )}
            {instance.last_disconnected_at && (
              <div className="text-sm text-muted-foreground">
                Última desconexão:{' '}
                {format(new Date(instance.last_disconnected_at), 'dd/MM/yyyy HH:mm')}
              </div>
            )}
          </div>
        )}
        <DialogFooter className="flex justify-between w-full">
          {instance ? (
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              Deletar
            </Button>
          ) : (
            <div></div>
          )}
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              Salvar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
