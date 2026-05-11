import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
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
import { format } from 'date-fns'
import { Calendar, Loader2 } from 'lucide-react'

export function HolidaysTab() {
  const [holidays, setHolidays] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const { toast } = useToast()

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('holidays').select('*').order('date', { ascending: true })
    setHolidays(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async () => {
    const payload = {
      date: formData.date,
      name: formData.name,
      scope: formData.scope || 'national',
      region: formData.scope === 'regional' ? formData.region : null,
      is_manual: formData.is_manual || false,
    }

    if (formData.id) {
      const { error } = await supabase.from('holidays').update(payload).eq('id', formData.id)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Feriado atualizado' })
        setIsModalOpen(false)
        load()
      }
    } else {
      const { error } = await supabase.from('holidays').insert(payload)
      if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
      else {
        toast({ title: 'Feriado adicionado' })
        setIsModalOpen(false)
        load()
      }
    }
  }

  const handleDelete = async () => {
    if (!formData.id || !window.confirm('Tem certeza que deseja deletar?')) return
    const { error } = await supabase.from('holidays').delete().eq('id', formData.id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Feriado removido' })
      setIsModalOpen(false)
      load()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Feriados e Datas Comemorativas</h2>
        <Button
          onClick={() => {
            setFormData({})
            setIsModalOpen(true)
          }}
        >
          Adicionar Feriado
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Escopo</TableHead>
              <TableHead>Região</TableHead>
              <TableHead>Manual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : holidays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  Sem feriados configurados
                </TableCell>
              </TableRow>
            ) : (
              holidays.map((h) => (
                <TableRow
                  key={h.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => {
                    setFormData(h)
                    setIsModalOpen(true)
                  }}
                >
                  <TableCell className="font-medium">
                    {format(new Date(h.date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell>{h.name}</TableCell>
                  <TableCell className="capitalize">{h.scope}</TableCell>
                  <TableCell>{h.region || '-'}</TableCell>
                  <TableCell>{h.is_manual ? 'Sim' : 'Não'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{formData.id ? 'Detalhes do Feriado' : 'Novo Feriado'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Data</Label>
              <Input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label>Nome do Feriado</Label>
              <Input
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Natal"
              />
            </div>
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
                  <SelectItem value="national">Nacional</SelectItem>
                  <SelectItem value="regional">Regional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.scope === 'regional' && (
              <div className="grid gap-2">
                <Label>Região (Estado/Cidade)</Label>
                <Input
                  value={formData.region || ''}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="Ex: SP"
                />
              </div>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                checked={formData.is_manual || false}
                onCheckedChange={(c) => setFormData({ ...formData, is_manual: c })}
              />
              <Label>Adicionado Manualmente</Label>
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
