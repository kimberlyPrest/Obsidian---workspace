import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
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
import { format } from 'date-fns'
import { Mic, Loader2 } from 'lucide-react'

export function ToneOfVoiceTab() {
  const [tones, setTones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const { toast } = useToast()

  const load = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('tone_of_voice')
      .select('*')
      .order('created_at', { ascending: false })
    setTones(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async () => {
    const payload = {
      scope: formData.scope || 'pessoal_geral',
      client_id: formData.client_id || null,
      style_guidelines_md: formData.style_guidelines_md || '',
      examples_jsonb: formData.examples_jsonb || [],
    }

    if (formData.id) {
      const { error } = await supabase.from('tone_of_voice').update(payload).eq('id', formData.id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Tom atualizado' })
        setIsModalOpen(false)
        load()
      }
    } else {
      const { error } = await supabase.from('tone_of_voice').insert(payload)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Tom criado' })
        setIsModalOpen(false)
        load()
      }
    }
  }

  const handleDelete = async () => {
    if (!formData.id || !window.confirm('Tem certeza que deseja deletar?')) return
    const { error } = await supabase.from('tone_of_voice').delete().eq('id', formData.id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Tom removido' })
      setIsModalOpen(false)
      load()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Tone of Voice</h2>
        <Button
          onClick={() => {
            setFormData({})
            setIsModalOpen(true)
          }}
        >
          Adicionar Tone
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Escopo</TableHead>
              <TableHead>Cliente ID</TableHead>
              <TableHead>Exemplos</TableHead>
              <TableHead>Última Refinação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : tones.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  <Mic className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Sem diretrizes de tom
                </TableCell>
              </TableRow>
            ) : (
              tones.map((t) => (
                <TableRow
                  key={t.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setFormData(t)
                    setIsModalOpen(true)
                  }}
                >
                  <TableCell className="font-medium">{t.scope}</TableCell>
                  <TableCell>{t.client_id || 'Geral'}</TableCell>
                  <TableCell>{t.total_examples}</TableCell>
                  <TableCell>
                    {t.last_refined_at
                      ? format(new Date(t.last_refined_at), 'dd/MM/yyyy HH:mm')
                      : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Detalhes do Tone' : 'Novo Tone of Voice'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Escopo</Label>
              <Select
                value={formData.scope || ''}
                onValueChange={(v) => setFormData({ ...formData, scope: v })}
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
            <div className="grid gap-2">
              <Label>Diretrizes de Estilo (Markdown)</Label>
              <Textarea
                className="h-32"
                value={formData.style_guidelines_md || ''}
                onChange={(e) => setFormData({ ...formData, style_guidelines_md: e.target.value })}
                placeholder="Ex: Responda de forma amigável e direta..."
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
