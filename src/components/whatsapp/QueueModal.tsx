import { useState, useEffect } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { SendHorizontal, Trash2, RefreshCw } from 'lucide-react'

import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

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
import { Badge } from '@/components/ui/badge'

export function QueueModal({ item, open, onClose, onSuccess }: any) {
  const { toast } = useToast()
  const [content, setContent] = useState('')
  const [priority, setPriority] = useState('normal')
  const [scheduledAt, setScheduledAt] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (item) {
      setContent(item.content || '')
      setPriority(item.priority || 'normal')
      if (item.scheduled_at) {
        const d = new Date(item.scheduled_at)
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
        setScheduledAt(d.toISOString().slice(0, 16))
      }
    }
  }, [item])

  if (!item) return null

  const isScheduled = item.status === 'scheduled' || item.status === 'retrying'

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('whatsapp_outbound_queue')
        .update({ content, priority, scheduled_at: new Date(scheduledAt).toISOString() })
        .eq('id', item.id)
      if (error) throw error
      toast({ description: 'Mensagem atualizada com sucesso' })
      onSuccess()
    } catch (e: any) {
      toast({ variant: 'destructive', description: e.message })
    } finally {
      setSaving(false)
    }
  }

  const handleSendNow = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from('whatsapp_outbound_queue')
        .update({
          status: 'scheduled',
          scheduled_at: new Date().toISOString(),
          priority: 'immediate',
        })
        .eq('id', item.id)
      if (error) throw error
      toast({ description: 'Enviando mensagem...' })
      onSuccess()
    } catch (e: any) {
      toast({ variant: 'destructive', description: e.message })
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Tem certeza que deseja cancelar e excluir esta mensagem?')) return
    setSaving(true)
    try {
      const { error } = await supabase.from('whatsapp_outbound_queue').delete().eq('id', item.id)
      if (error) throw error
      toast({ description: 'Mensagem cancelada e removida' })
      onSuccess()
    } catch (e: any) {
      toast({ variant: 'destructive', description: e.message })
    } finally {
      setSaving(false)
    }
  }

  const handleResend = async () => {
    setSaving(true)
    try {
      if (item.status === 'failed') {
        const { error } = await supabase
          .from('whatsapp_outbound_queue')
          .update({ status: 'scheduled', scheduled_at: new Date().toISOString(), attempts: 0 })
          .eq('id', item.id)
        if (error) throw error
      } else {
        const {
          id,
          created_at,
          updated_at,
          status,
          sent_at,
          delivered_at,
          read_at,
          attempts,
          last_error,
          result_message_id,
          evolution_message_id,
          ...rest
        } = item
        const { error } = await supabase.from('whatsapp_outbound_queue').insert({
          ...rest,
          contact_id: item.contact?.id || item.contact_id,
          status: 'scheduled',
          scheduled_at: new Date().toISOString(),
          attempts: 0,
          priority: 'immediate',
        })
        if (error) throw error
      }
      toast({ description: 'Reenviando mensagem...' })
      onSuccess()
    } catch (e: any) {
      toast({ variant: 'destructive', description: e.message })
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (ts: string) =>
    ts ? format(parseISO(ts), 'dd/MM/yyyy HH:mm:ss', { locale: ptBR }) : '-'

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground font-heading">
            Detalhes do Envio
            <Badge variant="secondary" className="ml-2">
              {item.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-primary uppercase tracking-wider">
              1. Mensagem
            </h4>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Conteúdo ({item.media_type})</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={!isScheduled}
                className="min-h-[100px] bg-background border-border"
              />
              {item.media_url && (
                <div className="text-sm mt-2">
                  <a
                    href={item.media_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visualizar Mídia
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm text-primary uppercase tracking-wider">
              2. Agendamento
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Agendado para</Label>
                <Input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  disabled={!isScheduled}
                  className="bg-background border-border"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-muted-foreground">Prioridade</Label>
                <Select value={priority} onValueChange={setPriority} disabled={!isScheduled}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="immediate">Imediata</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {(item.batch_id || item.lote_position !== null) && (
              <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                {item.batch_id && <span>Batch ID: {item.batch_id}</span>}
                {item.lote_position !== null && <span>Posição Lote: {item.lote_position}</span>}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-sm text-primary uppercase tracking-wider">
              3. Histórico
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm bg-card-secondary p-4 rounded-lg border border-border">
              <div>
                <span className="text-muted-foreground">Enviado em:</span>{' '}
                {formatDate(item.sent_at)}
              </div>
              <div>
                <span className="text-muted-foreground">Entregue em:</span>{' '}
                {formatDate(item.delivered_at)}
              </div>
              <div>
                <span className="text-muted-foreground">Lido em:</span> {formatDate(item.read_at)}
              </div>
              <div>
                <span className="text-muted-foreground">Tentativas:</span>{' '}
                <Badge variant="outline">{item.attempts}</Badge>
              </div>
              {item.last_error && (
                <div className="col-span-2 text-red-500 mt-2 p-2 bg-red-500/10 rounded-md border border-red-500/20">
                  <span className="font-semibold">Último erro:</span> {item.last_error}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {isScheduled && (
            <>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={saving}
                className="mr-auto"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Cancelar
              </Button>
              <Button
                variant="secondary"
                onClick={handleSave}
                disabled={saving}
                className="bg-card-secondary hover:bg-border text-foreground border border-border"
              >
                Salvar
              </Button>
              <Button
                onClick={handleSendNow}
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <SendHorizontal className="w-4 h-4 mr-2" /> Enviar Agora
              </Button>
            </>
          )}

          {(item.status === 'sent' || item.status === 'failed' || item.status === 'cancelled') && (
            <Button
              onClick={handleResend}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Reenviar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
