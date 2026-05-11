import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Send } from 'lucide-react'

export function SendMessageDialog({ open, onOpenChange, instanceId, contact }: any) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!text.trim()) return
    setLoading(true)

    const { error } = await supabase.from('whatsapp_outbound_queue').insert({
      instance_id: instanceId,
      contact_id: contact.id,
      remote_jid: contact.remote_jid,
      client_id: contact.client_id,
      content: text,
      media_type: 'text',
      priority: 'normal',
      status: 'scheduled',
      scheduled_at: new Date().toISOString(),
    })

    setLoading(false)

    if (error) {
      toast.error('Erro ao agendar', { description: error.message })
    } else {
      toast.success('Mensagem agendada com sucesso')
      setText('')
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-foreground">
            Enviar Mensagem
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Para: {contact?.push_name || contact?.phone_number}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Digite sua mensagem aqui..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] resize-none bg-card-secondary border-border focus-visible:ring-primary text-foreground"
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-border hover:bg-card-secondary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSend}
            disabled={!text.trim() || loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            <Send className="h-4 w-4 mr-2" />
            {loading ? 'Agendando...' : 'Enviar Agora'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
