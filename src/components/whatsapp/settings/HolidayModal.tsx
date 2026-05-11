import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Calendar } from 'lucide-react'

export function HolidayModal({ isOpen, onClose, holiday, onSaved }: any) {
  const [formData, setFormData] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const isCreate = !holiday

  useEffect(() => {
    if (isOpen)
      setFormData(holiday || { date: '', name: '', scope: 'national', region: '', is_manual: true })
  }, [isOpen, holiday])

  const handleSave = async () => {
    if (!formData.date || !formData.name) {
      toast({
        title: 'Aviso',
        description: 'Data e Nome são obrigatórios.',
        variant: 'destructive',
      })
      return
    }

    setSaving(true)
    const payload = {
      date: formData.date,
      name: formData.name,
      scope: formData.scope,
      region: formData.scope !== 'national' ? formData.region || null : null,
      is_manual: formData.is_manual,
    }

    const { error } = isCreate
      ? await supabase.from('holidays').insert(payload)
      : await supabase.from('holidays').update(payload).eq('id', holiday.id)

    if (error) {
      // Supabase unique constraint violation handling (since there are unique indexes on dates)
      if (error.code === '23505')
        toast({
          title: 'Feriado Duplicado',
          description: 'Já existe um feriado com essas características.',
          variant: 'destructive',
        })
      else toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' })
    } else {
      toast({ title: `Feriado ${isCreate ? 'cadastrado' : 'atualizado'} com sucesso.` })
      onSaved()
      onClose()
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirm('Deseja remover este feriado do calendário?')) return
    setSaving(true)
    const { error } = await supabase.from('holidays').delete().eq('id', holiday.id)
    if (error) toast({ title: 'Erro', description: error.message, variant: 'destructive' })
    else {
      toast({ title: 'Feriado removido.' })
      onSaved()
      onClose()
    }
    setSaving(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>{isCreate ? 'Agendar Novo Feriado' : 'Ajustar Feriado'}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data do Feriado</Label>
              <Input
                type="date"
                value={formData.date || ''}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Escopo Territorial</Label>
              <Select
                value={formData.scope}
                onValueChange={(v) =>
                  setFormData({
                    ...formData,
                    scope: v,
                    region: v === 'national' ? '' : formData.region,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="national">Nacional</SelectItem>
                  <SelectItem value="state">Estadual</SelectItem>
                  <SelectItem value="city">Municipal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nome / Motivo</Label>
            <Input
              placeholder="Ex: Dia do Trabalho"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {formData.scope !== 'national' && (
            <div className="space-y-2 bg-muted/30 p-3 rounded border">
              <Label>Região Específica</Label>
              <p className="text-xs text-muted-foreground mb-1">
                Especifique o estado (ex: SP) ou a cidade (ex: Campinas-SP).
              </p>
              <Input
                placeholder="SP ou São Paulo-SP"
                value={formData.region || ''}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              />
            </div>
          )}

          <div className="flex items-center space-x-3 mt-2">
            <Switch
              checked={formData.is_manual || false}
              onCheckedChange={(c) => setFormData({ ...formData, is_manual: c })}
            />
            <div>
              <Label className="text-base cursor-pointer font-medium">Inserção Manual</Label>
              <p className="text-xs text-muted-foreground">
                Desmarque se este for gerado via sistema/api.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between sm:justify-between items-center mt-2 border-t pt-4">
          {!isCreate ? (
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              Remover
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
              {saving ? 'Registrando...' : 'Salvar Feriado'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
