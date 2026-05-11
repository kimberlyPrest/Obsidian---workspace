import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

export function InstanceModal({ isOpen, onClose, instance, onSaved }: any) {
  const [formData, setFormData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const isCreate = !instance

  useEffect(() => {
    if (isOpen) {
      setFormData(
        instance || {
          instance_name: '',
          base_url: '',
          display_label: '',
          owner_phone: '',
          owner_name: '',
          is_default: false,
          status: 'unknown',
        },
      )
    }
  }, [isOpen, instance])

  const handleSave = async () => {
    if (isCreate && (!formData.instance_name || !formData.base_url)) {
      toast({
        title: 'Aviso',
        description: 'Instance Name e Base URL são obrigatórios na criação.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    const payload = {
      display_label: formData.display_label || null,
      owner_phone: formData.owner_phone || null,
      owner_name: formData.owner_name || null,
      is_default: formData.is_default,
    }

    let error
    if (isCreate) {
      const { error: insErr } = await supabase.from('evolution_instances').insert({
        ...payload,
        instance_name: formData.instance_name,
        base_url: formData.base_url,
      })
      error = insErr
    } else {
      const { error: updErr } = await supabase
        .from('evolution_instances')
        .update(payload)
        .eq('id', instance.id)
      error = updErr
    }

    if (error) {
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: `Instância ${isCreate ? 'criada' : 'atualizada'} com sucesso.` })
      onSaved()
      onClose()
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (
      !confirm(
        'Esta ação é irreversível. Tem certeza que deseja deletar a instância do banco de dados?',
      )
    )
      return
    setSaving(true)
    const { error } = await supabase.from('evolution_instances').delete().eq('id', instance.id)
    if (error)
      toast({ title: 'Erro ao deletar', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Instância deletada.' })
      onSaved()
      onClose()
    }
    setSaving(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isCreate ? 'Adicionar Nova Instância' : 'Detalhes da Instância'}
          </DialogTitle>
          <DialogDescription>
            {isCreate
              ? 'Informe os detalhes para registrar uma instância conectada da Evolution API.'
              : `Gerenciando a instância ${formData.instance_name}`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="grid gap-2">
            <Label>Instance Name</Label>
            <Input
              placeholder="ex: zap_empresa_v1"
              value={formData.instance_name || ''}
              onChange={(e) => setFormData({ ...formData, instance_name: e.target.value })}
              disabled={!isCreate}
            />
          </div>
          <div className="grid gap-2">
            <Label>Base URL</Label>
            <Input
              placeholder="ex: https://api.evolution.com"
              value={formData.base_url || ''}
              onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
              disabled={!isCreate}
            />
          </div>

          <div className="grid gap-2">
            <Label>Display Label (Opcional)</Label>
            <Input
              placeholder="Nome amigável"
              value={formData.display_label || ''}
              onChange={(e) => setFormData({ ...formData, display_label: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Owner Phone</Label>
              <Input
                placeholder="551199999999"
                value={formData.owner_phone || ''}
                onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Owner Name</Label>
              <Input
                placeholder="Nome do responsável"
                value={formData.owner_name || ''}
                onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-2 bg-muted/40 p-4 rounded-lg border">
            <Switch
              checked={formData.is_default || false}
              onCheckedChange={(c) => setFormData({ ...formData, is_default: c })}
            />
            <div>
              <Label className="text-base cursor-pointer">Instância Padrão</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Utilizada como padrão para disparos quando não especificada.
              </p>
            </div>
          </div>

          {!isCreate && (
            <div className="flex items-center justify-between p-3 border rounded-md mt-2">
              <span className="text-sm font-medium text-muted-foreground">
                Status Atual na Evolution
              </span>
              <Badge
                variant={formData.status === 'connected' ? 'default' : 'secondary'}
                className="uppercase"
              >
                {formData.status || 'unknown'}
              </Badge>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between items-center w-full pt-4">
          {!isCreate ? (
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              Deletar Registro
            </Button>
          ) : (
            <div />
          )}
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {saving ? 'Salvando...' : 'Salvar Instância'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
