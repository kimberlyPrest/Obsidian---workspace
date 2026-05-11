import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { format } from 'date-fns'

export function TemplateModal({ open, onOpenChange, template, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    template_text: '',
    trigger_pattern: '',
    tone_scope: 'pessoal_geral',
    client_id: 'none',
    auto_send_enabled: false,
    em_prova_ate: '',
  })

  useEffect(() => {
    supabase
      .from('clients')
      .select('id, name')
      .then(({ data }) => setClients(data || []))
  }, [])

  useEffect(() => {
    if (template) {
      setFormData({
        template_text: template.template_text,
        trigger_pattern: template.trigger_pattern || '',
        tone_scope: template.tone_scope,
        client_id: template.client_id || 'none',
        auto_send_enabled: template.auto_send_enabled,
        em_prova_ate: template.em_prova_ate ? template.em_prova_ate.split('T')[0] : '',
      })
    } else {
      setFormData({
        template_text: '',
        trigger_pattern: '',
        tone_scope: 'pessoal_geral',
        client_id: 'none',
        auto_send_enabled: false,
        em_prova_ate: '',
      })
    }
  }, [template, open])

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = {
        template_text: formData.template_text,
        trigger_pattern: formData.trigger_pattern,
        tone_scope: formData.tone_scope,
        client_id: formData.client_id === 'none' ? null : formData.client_id,
        auto_send_enabled: formData.auto_send_enabled,
        em_prova_ate: formData.em_prova_ate ? new Date(formData.em_prova_ate).toISOString() : null,
      }
      if (template) {
        const { error } = await supabase
          .from('whatsapp_templates_semanticos')
          .update(payload)
          .eq('id', template.id)
        if (error) throw error
        toast.success('Template atualizado')
      } else {
        const { error } = await supabase.from('whatsapp_templates_semanticos').insert([payload])
        if (error) throw error
        toast.success('Template criado')
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
    if (!confirm('Deletar?')) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('whatsapp_templates_semanticos')
        .delete()
        .eq('id', template.id)
      if (error) throw error
      toast.success('Deletado com sucesso')
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
          <DialogTitle>{template ? 'Detalhes do Template' : 'Novo Template'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Template Text</Label>
            <Textarea
              rows={3}
              value={formData.template_text}
              onChange={(e) => setFormData({ ...formData, template_text: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Trigger Pattern (Regex - Opcional)</Label>
            <Input
              value={formData.trigger_pattern}
              onChange={(e) => setFormData({ ...formData, trigger_pattern: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tone Scope</Label>
              <Select
                value={formData.tone_scope}
                onValueChange={(v) => setFormData({ ...formData, tone_scope: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pessoal_geral">Pessoal Geral</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Client (Opcional)</Label>
              <Select
                value={formData.client_id}
                onValueChange={(v) => setFormData({ ...formData, client_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nenhum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Switch
                checked={formData.auto_send_enabled}
                onCheckedChange={(c) => setFormData({ ...formData, auto_send_enabled: c })}
              />
              <Label>Auto Send Enabled</Label>
            </div>
            <div className="space-y-2">
              <Label>Em Prova Até</Label>
              <Input
                type="date"
                value={formData.em_prova_ate}
                onChange={(e) => setFormData({ ...formData, em_prova_ate: e.target.value })}
              />
            </div>
          </div>
          {template && (
            <div className="bg-card-secondary p-3 rounded-md text-sm text-muted-foreground flex justify-between mt-4">
              <span>Usos: {template.total_uses}</span>
              <span>Aprovações Consecutivas: {template.consecutive_approvals}</span>
              {template.last_used_at && (
                <span>Último uso: {format(new Date(template.last_used_at), 'dd/MM')}</span>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between w-full">
          {template ? (
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
