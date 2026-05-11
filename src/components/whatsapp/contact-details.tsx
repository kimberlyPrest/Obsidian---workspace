import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import { SendMessageDialog } from './send-message-dialog'
import { useNavigate } from 'react-router-dom'
import { User, Send, Lightbulb, Clock } from 'lucide-react'

const safeFormatDate = (ts: string) => {
  if (!ts) return '-'
  try {
    return format(new Date(ts), 'dd/MM HH:mm')
  } catch {
    return '-'
  }
}

export function ContactDetails({ instanceId, contactId }: any) {
  const [contact, setContact] = useState<any>(null)
  const [status, setStatus] = useState<any>(null)
  const [sendOpen, setSendOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('whatsapp_contacts')
      .select('*')
      .eq('id', contactId)
      .single()
      .then(({ data }) => setContact(data))

    supabase
      .from('whatsapp_conversation_status')
      .select('*')
      .eq('contact_id', contactId)
      .single()
      .then(({ data }) => setStatus(data))

    const sub = supabase
      .channel(`details_${contactId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whatsapp_conversation_status',
          filter: `contact_id=eq.${contactId}`,
        },
        (payload) => {
          setStatus(payload.new)
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(sub)
    }
  }, [contactId])

  if (!contact)
    return (
      <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
        <User className="h-8 w-8 mb-2 opacity-20" />
        <p className="text-sm">Carregando detalhes...</p>
      </div>
    )

  return (
    <div className="flex flex-col h-full bg-card overflow-y-auto">
      <div className="p-8 flex flex-col items-center text-center border-b border-border">
        <Avatar className="h-24 w-24 mb-4 border-2 border-border shadow-sm">
          <AvatarImage src={contact.profile_picture_url || ''} />
          <AvatarFallback className="text-2xl bg-card-secondary text-muted-foreground">
            {contact.push_name?.substring(0, 2).toUpperCase() || 'U'}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-heading font-semibold text-foreground">
          {contact.push_name || 'Desconhecido'}
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          {contact.phone_number || contact.remote_jid}
        </p>

        <Badge
          variant="outline"
          className="mt-4 bg-card-secondary border-border text-xs px-3 py-1 font-medium capitalize"
        >
          {status?.status?.replace(/_/g, ' ') || 'desconhecido'}
        </Badge>
      </div>

      <div className="p-6 space-y-6 flex-1">
        <div>
          <h3 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider flex items-center">
            <Clock className="h-3 w-3 mr-2" /> Métricas
          </h3>
          <div className="space-y-3 text-sm bg-card-secondary p-4 rounded-lg border border-border">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Última recebida:</span>
              <span className="font-medium text-foreground">
                {safeFormatDate(status?.last_inbound_at)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Última enviada:</span>
              <span className="font-medium text-foreground">
                {safeFormatDate(status?.last_outbound_at)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Não lidas:</span>
              <span className="font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                {status?.unread_count || 0}
              </span>
            </div>
          </div>
        </div>

        <Separator className="bg-border" />

        <div className="space-y-3 pt-2">
          <Button className="w-full font-medium" onClick={() => setSendOpen(true)}>
            <Send className="h-4 w-4 mr-2" />
            Enviar Mensagem
          </Button>
          <Button
            variant="outline"
            className="w-full bg-card-secondary border-border text-foreground hover:bg-border transition-colors"
            onClick={() => navigate(`/whatsapp/suggestions?contactId=${contactId}`)}
          >
            <Lightbulb className="h-4 w-4 mr-2 text-warning" />
            Ver Sugestões
          </Button>
        </div>
      </div>

      <SendMessageDialog
        open={sendOpen}
        onOpenChange={setSendOpen}
        instanceId={instanceId}
        contact={contact}
      />
    </div>
  )
}
