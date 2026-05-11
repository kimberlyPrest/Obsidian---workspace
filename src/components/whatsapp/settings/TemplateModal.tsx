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
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2, BrainCircuit } from 'lucide-react'

export function TemplateModal({ isOpen, onClose, template, onSaved }: any) {
  const [formData, setFormData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const isCreate = !template

  useEffect(() => {
    if (isOpen)
      setFormData(
        template || {
          template_text: '',
          trigger_pattern: '',
          tone_scope: 'pessoal_geral',
          client_id: '',
          auto_send_enabled: false,
          em_prova_ate: '',
        },
      )
  }, [isOpen, template])

  const handleSave = async () => {
    if (!formData.template_text) {
      toast({
        title: 'Aviso',
        description: 'O texto do template é obrigatório.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    const payload = {
      template_text: formData.template_text,
      trigger_pattern: formData.trigger_pattern || null,
      tone_scope: formData.tone_scope,
      client_id: formData.tone_scope === 'client' ? formData.client_id || null : null,
      auto_send_enabled: formData.auto_send_enabled,
      em_prova_ate: formData.em_prova_ate || null,
    }

    const { error } = isCreate
      ? await supabase.from('whatsapp_templates_semanticos').insert(payload)
      : await supabase.from('whatsapp_templates_semanticos').update(payload).eq('id', template.id)

    if (error)
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Template salvo com sucesso' })
      onSaved()
      onClose()
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Excluir este template do banco de conhecimento?')) return
    setSaving(true)
    const { error } = await supabase
      .from('whatsapp_templates_semanticos')
      .delete()
      .eq('id', template.id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Template excluído.' })
      onSaved()
      onClose()
    }
    setSaving(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] h-[90vh] sm:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <span>{isCreate ? 'Ensinar Novo Template' : 'Refinar Template'}</span>
          </DialogTitle>
          <DialogDescription>
            Estruture as respostas fixas ou base de conhecimento da inteligência artificial.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="space-y-2">
            <Label className="text-base">Texto da Resposta (Template)</Label>
            <Textarea
              className="h-32 leading-relaxed"
              placeholder="Resposta estruturada que será gerada..."
              value={formData.template_text || ''}
              onChange={(e) => setFormData({ ...formData, template_text: e.target.value })}
            />
          </div>

          <div className="space-y-2 bg-muted/40 p-4 rounded-lg border border-dashed">
            <Label>Padrão de Gatilho (RegEx opcional)</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Se informado, o sistema utilizará este Regex para buscar correspondências na mensagem
              do cliente e forçar esta resposta.
            </p>
            <Input
              className="font-mono text-sm"
              placeholder="(?i)(preço|valor|custo)"
              value={formData.trigger_pattern || ''}
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
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pessoal_geral">Global / Geral</SelectItem>
                  <SelectItem value="client">Específico por Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                className={formData.tone_scope === 'pessoal_geral' ? 'text-muted-foreground' : ''}
              >
                Client ID {formData.tone_scope === 'pessoal_geral' && '(Ignorado)'}
              </Label>
              <Input
                placeholder="UUID do cliente"
                value={formData.client_id || ''}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                disabled={formData.tone_scope === 'pessoal_geral'}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-center bg-card p-4 rounded-lg border mt-2 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.auto_send_enabled || false}
                  onCheckedChange={(c) => setFormData({ ...formData, auto_send_enabled: c })}
                />
                <Label className="font-semibold text-base cursor-pointer">Envio Automático</Label>
              </div>
              <p className="text-xs text-muted-foreground pl-11">
                Pula aprovação humana e envia diretamente.
              </p>
            </div>

            <div className="space-y-2 border-l pl-4">
              <Label className="text-xs">Em Período de Prova Até (Opcional)</Label>
              <Input
                type="date"
                value={formData.em_prova_ate?.split('T')[0] || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    em_prova_ate: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
              />
            </div>
          </div>

          {!isCreate && (
            <div className="grid grid-cols-3 gap-2 mt-2 bg-primary/5 p-4 rounded-lg text-sm text-center border border-primary/10">
              <div>
                <p className="font-bold text-2xl text-primary">{formData.total_uses || 0}</p>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mt-1">
                  Usos Totais
                </p>
              </div>
              <div className="border-x border-primary/20">
                <p className="font-bold text-2xl text-emerald-600">
                  {formData.consecutive_approvals || 0}
                </p>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mt-1">
                  Aprovações Rápidas
                </p>
              </div>
              <div>
                <p className="font-bold text-lg leading-7 truncate text-foreground">
                  {formData.last_used_at
                    ? format(new Date(formData.last_used_at), 'dd/MM/yy')
                    : '-'}
                </p>
                <p className="text-muted-foreground text-xs uppercase tracking-wider font-semibold mt-1">
                  Último Disparo
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between items-center w-full pt-4">
          {!isCreate ? (
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              Excluir Base
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
              {saving ? 'Registrando...' : 'Salvar Conhecimento'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
