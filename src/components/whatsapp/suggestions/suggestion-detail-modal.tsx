import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Check, X, Send, Copy, Eraser, User, Bot, MessageSquare, Lightbulb } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

export function SuggestionDetailModal({ suggestion, open, onOpenChange, onSuccess }: any) {
  const { user } = useAuth()
  const [text, setText] = useState(suggestion?.final_text || suggestion?.suggested_text || '')
  const [contextMessages, setContextMessages] = useState<any[]>([])
  const [loadingContext, setLoadingContext] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open && suggestion) {
      setText(suggestion.final_text || suggestion.suggested_text || '')
      loadContext()
    }
  }, [open, suggestion])

  const loadContext = async () => {
    if (!suggestion?.contact_id || !suggestion?.trigger_message?.id) return
    setLoadingContext(true)
    try {
      const { data: triggerData } = await supabase
        .from('whatsapp_messages')
        .select('message_timestamp')
        .eq('id', suggestion.trigger_message.id)
        .single()

      if (!triggerData) return

      const { data } = await supabase
        .from('whatsapp_messages')
        .select('id, content, from_me, message_timestamp, media_type')
        .eq('contact_id', suggestion.contact_id)
        .lte('message_timestamp', triggerData.message_timestamp)
        .order('message_timestamp', { ascending: false })
        .limit(4)

      if (data) {
        setContextMessages(data.reverse())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingContext(false)
    }
  }

  const handleAction = async (action: 'approve' | 'reject' | 'send') => {
    setSubmitting(true)
    try {
      const now = new Date().toISOString()
      const userId = user?.id

      if (action === 'reject') {
        const { error } = await supabase
          .from('whatsapp_suggestions')
          .update({
            status: 'rejected',
            decided_by: userId,
            decided_at: now,
          })
          .eq('id', suggestion.id)
        if (error) throw error
        toast({ title: 'Sugestão rejeitada' })
      } else {
        const { error } = await supabase
          .from('whatsapp_suggestions')
          .update({
            status: 'approved',
            final_text: text,
            approval_count_consecutive: suggestion.approval_count_consecutive + 1,
            decided_by: userId,
            decided_at: now,
          })
          .eq('id', suggestion.id)
        if (error) throw error

        if (action === 'send') {
          const { error: sendError } = await supabase.from('whatsapp_outbound_queue').insert({
            instance_id: suggestion.contact?.instance_id || null,
            contact_id: suggestion.contact_id,
            client_id: suggestion.client_id,
            remote_jid: suggestion.remote_jid,
            content: text,
            media_type: 'text',
            status: 'scheduled',
            scheduled_at: now,
            source_suggestion_id: suggestion.id,
            priority: 'normal',
          })
          if (sendError) throw sendError
          toast({ title: 'Mensagem agendada com sucesso' })
        } else {
          toast({ title: 'Sugestão aprovada' })
        }
      }
      onSuccess?.()
    } catch (error: any) {
      toast({
        title: 'Erro ao processar sugestão',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!suggestion) return null

  const contactName =
    suggestion.contact?.push_name ||
    suggestion.contact?.display_name ||
    suggestion.contact?.phone_number ||
    suggestion.remote_jid

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col p-0 gap-0 border-border bg-background sm:rounded-xl">
        <DialogHeader className="p-4 sm:p-6 border-b border-border bg-card">
          <DialogTitle className="text-xl font-heading flex flex-col sm:flex-row sm:items-center justify-between text-foreground gap-2">
            <span>
              Revisar Sugestão para <span className="text-primary">{contactName}</span>
            </span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Recebida em {format(new Date(suggestion.created_at), 'dd/MM/yyyy HH:mm')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-4 sm:p-6">
          <div className="space-y-8">
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> Contexto da Conversa
              </h3>

              <div className="bg-card-secondary/30 rounded-lg p-4 space-y-4 border border-border">
                {loadingContext ? (
                  <div className="text-sm text-muted-foreground animate-pulse">
                    Carregando contexto...
                  </div>
                ) : contextMessages.length > 0 ? (
                  contextMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex flex-col max-w-[85%] rounded-lg p-3 text-sm',
                        msg.from_me
                          ? 'bg-primary/10 text-foreground ml-auto border border-primary/20'
                          : 'bg-card text-foreground border border-border',
                        msg.id === suggestion.trigger_message?.id &&
                          'ring-1 ring-warning shadow-[0_0_15px_rgba(255,184,0,0.1)]',
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1 opacity-70 text-xs">
                        {msg.from_me ? <Bot className="h-3 w-3" /> : <User className="h-3 w-3" />}
                        <span>{msg.from_me ? 'Nós' : contactName}</span>
                      </div>
                      <div className="whitespace-pre-wrap break-words">
                        {msg.content || `[${msg.media_type}]`}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">Sem mensagens anteriores</div>
                )}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-warning" /> Sugestão da IA
              </h3>
              <div className="bg-card p-4 rounded-lg border border-border relative">
                <p className="text-foreground text-sm whitespace-pre-wrap">
                  {suggestion.suggested_text}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  {suggestion.tone_used && (
                    <Badge
                      variant="outline"
                      className="bg-card-secondary border-border capitalize text-xs text-muted-foreground"
                    >
                      Tom: {suggestion.tone_used.replace(/_/g, ' ')}
                    </Badge>
                  )}
                  {suggestion.model_used && (
                    <span className="text-xs text-muted-foreground">
                      Modelo: {suggestion.model_used}
                    </span>
                  )}
                </div>
              </div>
            </section>

            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Send className="h-4 w-4 text-primary" /> Sua Resposta Final
                </h3>
                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => setText(suggestion.suggested_text)}
                  >
                    <Copy className="h-3 w-3 mr-2" /> Restaurar Sugestão
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                    onClick={() => setText('')}
                  >
                    <Eraser className="h-3 w-3 mr-2" /> Limpar
                  </Button>
                </div>
              </div>
              <Textarea
                className="min-h-[150px] bg-card border-border focus-visible:ring-primary resize-none text-base text-foreground"
                placeholder="Digite a resposta final..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="p-4 sm:p-6 border-t border-border bg-card flex flex-col sm:flex-row gap-3 sm:items-center">
          <Button
            variant="outline"
            className="border-border bg-card-secondary hover:bg-border w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <div className="flex-1 hidden sm:block" />
          {suggestion.status === 'pending' && (
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              onClick={() => handleAction('reject')}
              disabled={submitting}
            >
              <X className="h-4 w-4 mr-2" /> Rejeitar
            </Button>
          )}
          <Button
            variant="secondary"
            className="w-full sm:w-auto bg-card-secondary text-foreground hover:bg-border border border-border"
            onClick={() => handleAction('approve')}
            disabled={submitting || !text.trim()}
          >
            <Check className="h-4 w-4 mr-2 text-success" /> Aprovar (Salvar)
          </Button>
          <Button
            onClick={() => handleAction('send')}
            disabled={submitting || !text.trim()}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
          >
            <Send className="h-4 w-4 mr-2" /> Editar e Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
