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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Trash2, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { format } from 'date-fns'

export function ToneModal({ open, onOpenChange, tone, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<any[]>([])
  const [formData, setFormData] = useState({
    scope: 'pessoal_geral',
    client_id: 'none',
    style_guidelines_md: '',
    examples: [] as any[],
  })

  useEffect(() => {
    supabase
      .from('clients')
      .select('id, name')
      .then(({ data }) => setClients(data || []))
  }, [])

  useEffect(() => {
    if (tone) {
      setFormData({
        scope: tone.scope,
        client_id: tone.client_id || 'none',
        style_guidelines_md: tone.style_guidelines_md || '',
        examples: Array.isArray(tone.examples_jsonb) ? tone.examples_jsonb : [],
      })
    } else {
      setFormData({
        scope: 'pessoal_geral',
        client_id: 'none',
        style_guidelines_md: '',
        examples: [],
      })
    }
  }, [tone, open])

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = {
        scope: formData.scope,
        client_id: formData.client_id === 'none' ? null : formData.client_id,
        style_guidelines_md: formData.style_guidelines_md,
        examples_jsonb: formData.examples,
        total_examples: formData.examples.length,
      }
      if (tone) {
        const { error } = await supabase.from('tone_of_voice').update(payload).eq('id', tone.id)
        if (error) throw error
        toast.success('Tone atualizado')
      } else {
        const { error } = await supabase.from('tone_of_voice').insert([payload])
        if (error) throw error
        toast.success('Tone criado')
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
      const { error } = await supabase.from('tone_of_voice').delete().eq('id', tone.id)
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{tone ? 'Detalhes do Tone' : 'Novo Tone of Voice'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Scope</Label>
              <Select
                value={formData.scope}
                onValueChange={(v) => setFormData({ ...formData, scope: v })}
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
          <div className="space-y-2">
            <Label>Style Guidelines (Markdown)</Label>
            <Textarea
              rows={4}
              value={formData.style_guidelines_md}
              onChange={(e) => setFormData({ ...formData, style_guidelines_md: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Exemplos ({formData.examples.length})</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  setFormData({
                    ...formData,
                    examples: [...formData.examples, { trigger: '', response: '' }],
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Adicionar Exemplo
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {formData.examples.map((ex, i) => (
                <div key={i} className="flex space-x-2 items-start border p-2 rounded">
                  <div className="flex-1 space-y-2">
                    <Input
                      placeholder="Trigger (User)"
                      value={ex.trigger}
                      onChange={(e) => {
                        const n = [...formData.examples]
                        n[i].trigger = e.target.value
                        setFormData({ ...formData, examples: n })
                      }}
                    />
                    <Input
                      placeholder="Response (Agent)"
                      value={ex.response}
                      onChange={(e) => {
                        const n = [...formData.examples]
                        n[i].response = e.target.value
                        setFormData({ ...formData, examples: n })
                      }}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const n = [...formData.examples]
                      n.splice(i, 1)
                      setFormData({ ...formData, examples: n })
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          {tone && (
            <div className="bg-card-secondary p-3 rounded-md text-sm text-muted-foreground flex justify-between">
              <span>Total Exemplos: {tone.total_examples}</span>
              {tone.last_refined_at && (
                <span>Refinado em: {format(new Date(tone.last_refined_at), 'dd/MM/yyyy')}</span>
              )}
            </div>
          )}
        </div>
        <DialogFooter className="flex justify-between w-full">
          {tone ? (
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
