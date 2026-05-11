import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Menu, PanelRight, Check, CheckCheck, Clock, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const safeFormatTime = (ts: string) => {
  if (!ts) return ''
  try {
    return format(new Date(ts), 'HH:mm')
  } catch {
    return ''
  }
}

const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'read') return <CheckCheck className="h-3 w-3 text-primary" />
  if (status === 'delivered') return <CheckCheck className="h-3 w-3 text-muted-foreground" />
  if (status === 'sent') return <Check className="h-3 w-3 text-muted-foreground" />
  return <Clock className="h-3 w-3 text-muted-foreground" />
}

export function ChatArea({ instanceId, contactId, onOpenContacts, onToggleDetails }: any) {
  const [messages, setMessages] = useState<any[]>([])
  const [contact, setContact] = useState<any>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const fetchMessages = async (p = 0) => {
    if (p === 0) setLoading(true)
    const pageSize = 50
    const { data } = await supabase
      .from('whatsapp_messages')
      .select(
        '*, quoted:whatsapp_messages!whatsapp_messages_quoted_message_id_fkey(content, from_me, media_type)',
      )
      .eq('instance_id', instanceId)
      .eq('contact_id', contactId)
      .order('message_timestamp', { ascending: false })
      .range(p * pageSize, (p + 1) * pageSize - 1)

    if (data) {
      const reversed = [...data].reverse()
      if (p === 0) setMessages(reversed)
      else setMessages((prev) => [...reversed, ...prev])
      setHasMore(data.length === pageSize)
    }
    if (p === 0) setLoading(false)
  }

  useEffect(() => {
    setPage(0)
    fetchMessages(0)
    supabase
      .from('whatsapp_contacts')
      .select('*')
      .eq('id', contactId)
      .single()
      .then(({ data }) => setContact(data))
  }, [contactId])

  useEffect(() => {
    const sub = supabase
      .channel(`chat_${contactId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'whatsapp_messages',
          filter: `contact_id=eq.${contactId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new])
          setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'whatsapp_messages',
          filter: `contact_id=eq.${contactId}`,
        },
        (payload) => {
          setMessages((prev) =>
            prev.map((m) => (m.id === payload.new.id ? { ...m, ...payload.new } : m)),
          )
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(sub)
    }
  }, [contactId])

  useEffect(() => {
    if (page === 0 && !loading) {
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'auto' }), 100)
    }
  }, [messages, page, loading])

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4 bg-card z-10 shrink-0">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2 text-muted-foreground hover:text-foreground"
            onClick={onOpenContacts}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="font-medium font-heading">
            {contact?.push_name || contact?.phone_number || 'Carregando...'}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hidden md:flex"
          onClick={onToggleDetails}
        >
          <PanelRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={cn('flex max-w-[75%]', i % 2 === 0 ? 'ml-auto' : '')}>
                <Skeleton className="h-12 w-48 rounded-lg" />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground flex-col py-12">
            <MessageSquare className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">Nenhuma mensagem nesta conversa</p>
          </div>
        ) : (
          <>
            {hasMore && (
              <div className="flex justify-center mb-6">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setPage((p) => p + 1)
                    fetchMessages(page + 1)
                  }}
                >
                  Carregar mensagens antigas
                </Button>
              </div>
            )}
            <div className="space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'flex flex-col max-w-[85%] sm:max-w-[75%]',
                    m.from_me ? 'ml-auto items-end' : 'items-start',
                  )}
                >
                  <div
                    className={cn(
                      'px-3 py-2 rounded-xl text-sm whitespace-pre-wrap break-words shadow-sm border border-transparent',
                      m.from_me
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-card-secondary text-foreground border-border rounded-tl-sm',
                    )}
                  >
                    {m.quoted && (
                      <div
                        className={cn(
                          'text-xs p-2 mb-2 rounded bg-black/20 border-l-2',
                          m.quoted.from_me ? 'border-white/50' : 'border-primary',
                        )}
                      >
                        <p className="font-semibold mb-1 opacity-90">
                          {m.quoted.from_me ? 'Você' : contact?.push_name || 'Contato'}
                        </p>
                        <p className="truncate opacity-80">
                          {m.quoted.content || m.quoted.media_type}
                        </p>
                      </div>
                    )}
                    {m.content}
                    {m.media_type === 'audio' && (
                      <div className="mt-2 p-2 rounded bg-black/20 text-xs">
                        🎵 Áudio{' '}
                        {m.transcript ? (
                          <span className="block mt-1 italic">Transcrição: "{m.transcript}"</span>
                        ) : (
                          ''
                        )}
                      </div>
                    )}
                    {['image', 'video', 'document'].includes(m.media_type) && (
                      <div className="mt-2 text-xs font-semibold opacity-80 bg-black/20 p-2 rounded inline-block">
                        📎 Mídia: {m.media_type}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-1 mt-1 text-[10px] text-muted-foreground px-1">
                    <span>{safeFormatTime(m.message_timestamp)}</span>
                    {m.from_me && <StatusIcon status={m.status} />}
                  </div>
                </div>
              ))}
              <div ref={scrollRef} className="h-1" />
            </div>
          </>
        )}
      </ScrollArea>
    </div>
  )
}
