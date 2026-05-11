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
import { useToast } from '@/hooks/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2, Loader2, Info } from 'lucide-react'

export function ToneOfVoiceModal({ isOpen, onClose, tone, onSaved }: any) {
  const [formData, setFormData] = useState<any>({ examples_jsonb: [] })
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const isCreate = !tone

  useEffect(() => {
    if (isOpen) {
      setFormData(
        tone || {
          scope: 'pessoal_geral',
          client_id: '',
          style_guidelines_md: '',
          examples_jsonb: [],
        },
      )
    }
  }, [isOpen, tone])

  const handleSave = async () => {
    if (formData.scope === 'client' && !formData.client_id) {
      toast({
        title: 'Aviso',
        description: 'Client ID é obrigatório para o escopo "client".',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    const payload = {
      scope: formData.scope,
      client_id: formData.scope === 'pessoal_geral' ? null : formData.client_id || null,
      style_guidelines_md: formData.style_guidelines_md,
      examples_jsonb: formData.examples_jsonb || [],
      total_examples: (formData.examples_jsonb || []).length,
      last_refined_at: new Date().toISOString(),
    }

    const { error } = isCreate
      ? await supabase.from('tone_of_voice').insert(payload)
      : await supabase.from('tone_of_voice').update(payload).eq('id', tone.id)

    if (error)
      toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Tone of Voice salvo com sucesso' })
      onSaved()
      onClose()
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Deseja realmente deletar estas diretrizes?')) return
    setSaving(true)
    const { error } = await supabase.from('tone_of_voice').delete().eq('id', tone.id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Diretrizes deletadas' })
      onSaved()
      onClose()
    }
    setSaving(false)
  }

  const addExample = () =>
    setFormData({
      ...formData,
      examples_jsonb: [...(formData.examples_jsonb || []), { trigger: '', response: '' }],
    })
  const updateEx = (i: number, k: string, v: string) => {
    const list = [...(formData.examples_jsonb || [])]
    list[i][k] = v
    setFormData({ ...formData, examples_jsonb: list })
  }
  const removeEx = (i: number) => {
    const list = [...(formData.examples_jsonb || [])]
    list.splice(i, 1)
    setFormData({ ...formData, examples_jsonb: list })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[750px] h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-muted/20">
          <DialogTitle>{isCreate ? 'Definir Tone of Voice' : 'Afinar Tone of Voice'}</DialogTitle>
          <DialogDescription>
            Defina as regras de comportamento e estilo de resposta da IA.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Scope</Label>
              <Select
                value={formData.scope}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    scope: v,
                    client_id: v === 'pessoal_geral' ? '' : formData.client_id,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pessoal_geral">Pessoal Geral (Global)</SelectItem>
                  <SelectItem value="client">Client (Específico)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={formData.scope === 'pessoal_geral' ? 'text-muted-foreground' : ''}>
                Client ID {formData.scope === 'pessoal_geral' && '(Ignorado)'}
              </Label>
              <Input
                placeholder="UUID do cliente"
                value={formData.client_id || ''}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                disabled={formData.scope === 'pessoal_geral'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label>System Prompt / Style Guidelines</Label>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
            <Textarea
              className="min-h-[150px] font-mono text-sm leading-relaxed"
              placeholder="Você é um assistente prestativo. Seja sempre cordial e use emojis..."
              value={formData.style_guidelines_md || ''}
              onChange={(e) => setFormData({ ...formData, style_guidelines_md: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center bg-muted/40 p-3 rounded-lg border">
              <div>
                <Label className="text-base font-semibold">
                  Exemplos de Treinamento (Few-Shot)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Total atual: {formData.examples_jsonb?.length || 0}
                </p>
              </div>
              <Button size="sm" onClick={addExample}>
                <Plus className="h-4 w-4 mr-2" /> Novo Exemplo
              </Button>
            </div>

            <div className="space-y-3">
              {(formData.examples_jsonb || []).map((ex: any, i: number) => (
                <div
                  key={i}
                  className="border p-4 rounded-md space-y-3 relative group bg-card hover:border-primary/50 transition-colors shadow-sm"
                >
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
                    onClick={() => removeEx(i)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Trigger (Mensagem Recebida)
                    </Label>
                    <Input
                      className="mt-1"
                      value={ex.trigger}
                      onChange={(e) => updateEx(i, 'trigger', e.target.value)}
                      placeholder="Olá, qual o preço do serviço?"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                      Resposta Esperada
                    </Label>
                    <Textarea
                      className="mt-1 h-20"
                      value={ex.response}
                      onChange={(e) => updateEx(i, 'response', e.target.value)}
                      placeholder="Olá! 😊 Nossos serviços iniciam em..."
                    />
                  </div>
                </div>
              ))}
              {formData.examples_jsonb?.length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-4 border border-dashed rounded-md">
                  Adicione exemplos para ensinar o tom exato para a inteligência artificial.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t flex justify-between items-center bg-muted/10">
          {!isCreate ? (
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              Deletar Regras
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
              {saving ? 'Salvando...' : 'Salvar Treinamento'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
