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

export function HolidayModal({ open, onOpenChange, holiday, onSuccess }: any) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    scope: 'national',
    region: '',
    is_manual: false,
  })

  useEffect(() => {
    if (holiday) {
      setFormData({
        name: holiday.name,
        date: holiday.date,
        scope: holiday.scope,
        region: holiday.region || '',
        is_manual: holiday.is_manual,
      })
    } else {
      setFormData({ name: '', date: '', scope: 'national', region: '', is_manual: true })
    }
  }, [holiday, open])

  const handleSave = async () => {
    setLoading(true)
    try {
      const payload = {
        name: formData.name,
        date: formData.date,
        scope: formData.scope,
        region: formData.scope === 'regional' ? formData.region : null,
        is_manual: formData.is_manual,
      }
      if (holiday) {
        const { error } = await supabase.from('holidays').update(payload).eq('id', holiday.id)
        if (error) throw error
        toast.success('Feriado atualizado')
      } else {
        const { error } = await supabase.from('holidays').insert([payload])
        if (error) throw error
        toast.success('Feriado criado')
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
      const { error } = await supabase.from('holidays').delete().eq('id', holiday.id)
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{holiday ? 'Detalhes do Feriado' : 'Novo Feriado'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Data</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Escopo</Label>
            <Select
              value={formData.scope}
              onValueChange={(v) => setFormData({ ...formData, scope: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="national">Nacional</SelectItem>
                <SelectItem value="regional">Regional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {formData.scope === 'regional' && (
            <div className="space-y-2">
              <Label>Região (UF ou Cidade)</Label>
              <Input
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              />
            </div>
          )}
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              checked={formData.is_manual}
              onCheckedChange={(c) => setFormData({ ...formData, is_manual: c })}
            />
            <Label>Feriado Manual</Label>
          </div>
        </div>
        <DialogFooter className="flex justify-between w-full">
          {holiday ? (
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
