import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { FileText, Loader2 } from 'lucide-react'

export function TemplatesTab() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const { toast } = useToast()

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('whatsapp_templates_semanticos')
      .select('*')
      .order('total_uses', { ascending: false })
    setTemplates(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async () => {
    const payload = {
      template_text: formData.template_text,
      trigger_pattern: formData.trigger_pattern || null,
      tone_scope: formData.tone_scope || 'pessoal_geral',
      client_id: formData.client_id || null,
      auto_send_enabled: formData.auto_send_enabled || false,
      em_prova_ate: formData.em_prova_ate || null,
    }

    if (formData.id) {
      const { error } = await supabase
        .from('whatsapp_templates_semanticos')
        .update(payload)
        .eq('id', formData.id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Template atualizado' })
        setIsModalOpen(false)
        load()
      }
    } else {
      const { error } = await supabase.from('whatsapp_templates_semanticos').insert(payload)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Template criado' })
        setIsModalOpen(false)
        load()
      }
    }
  }

  const handleDelete = async () => {
    if (!formData.id || !window.confirm('Tem certeza que deseja deletar?')) return
    const { error } = await supabase
      .from('whatsapp_templates_semanticos')
      .delete()
      .eq('id', formData.id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Template removido' })
      setIsModalOpen(false)
      load()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Templates Semânticos</h2>
        <Button
          onClick={() => {
            setFormData({})
            setIsModalOpen(true)
          }}
        >
          Adicionar Template
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Template (Preview)</TableHead>
              <TableHead>Tone Scope</TableHead>
              <TableHead>Aprovações Seguidas</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead>Envio Automático</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : templates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Sem templates
                </TableCell>
              </TableRow>
            ) : (
              templates.map((t) => (
                <TableRow
                  key={t.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setFormData(t)
                    setIsModalOpen(true)
                  }}
                >
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {t.template_text}
                  </TableCell>
                  <TableCell>{t.tone_scope}</TableCell>
                  <TableCell>{t.consecutive_approvals}</TableCell>
                  <TableCell>{t.total_uses}</TableCell>
                  <TableCell>{t.auto_send_enabled ? 'Ativo' : 'Inativo'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Detalhes do Template' : 'Novo Template'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Texto do Template</Label>
              <Textarea
                className="h-24"
                value={formData.template_text || ''}
                onChange={(e) => setFormData({ ...formData, template_text: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Trigger Pattern (Regex opcional)</Label>
              <Input
                value={formData.trigger_pattern || ''}
                onChange={(e) => setFormData({ ...formData, trigger_pattern: e.target.value })}
                placeholder="^olá.*"
              />
            </div>
            <div className="grid gap-2">
              <Label>Tone Scope</Label>
              <Select
                value={formData.tone_scope || ''}
                onValueChange={(v) => setFormData({ ...formData, tone_scope: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pessoal_geral">Geral (pessoal_geral)</SelectItem>
                  <SelectItem value="client">Cliente Específico (client)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                checked={formData.auto_send_enabled || false}
                onCheckedChange={(c) => setFormData({ ...formData, auto_send_enabled: c })}
              />
              <Label>Envio Automático Habilitado</Label>
            </div>
            <div className="grid gap-2">
              <Label>Em Prova Até (Data Opcional)</Label>
              <Input
                type="date"
                value={formData.em_prova_ate ? formData.em_prova_ate.split('T')[0] : ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    em_prova_ate: e.target.value ? new Date(e.target.value).toISOString() : null,
                  })
                }
              />
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
