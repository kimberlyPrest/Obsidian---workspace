import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

const safeFormatTime = (ts: string) => {
  if (!ts) return ''
  try {
    return format(new Date(ts), 'HH:mm')
  } catch {
    return ''
  }
}

const formatJid = (jid: string) => {
  if (!jid) return ''
  const id = jid.split('@')[0]
  if (jid.endsWith('@lid')) return `LID: ${id}`
  if (jid.endsWith('@g.us')) return `Grupo: ${id}`
  return `+${id}`
}

export function ContactsSidebar({ instanceId, selectedContactId, onSelect }: any) {
  const [search, setSearch] = useState('')
  const [contacts, setContacts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchContacts = useCallback(
    async (searchTerm: string) => {
      setLoading(true)
      let q = supabase
        .from('whatsapp_contacts')
        .select('*, whatsapp_conversation_status(unread_count, status)')
        .eq('instance_id', instanceId)
        .eq('monitored', true)
        .order('last_message_at', { ascending: false, nullsFirst: true })

      if (searchTerm) {
        q = q.or(`push_name.ilike.%${searchTerm}%,phone_number.ilike.%${searchTerm}%`)
      }

      const { data } = await q
      if (data) setContacts(data)
      setLoading(false)
    },
    [instanceId],
  )

  useEffect(() => {
    const t = setTimeout(() => fetchContacts(search), 300)
    return () => clearTimeout(t)
  }, [search, fetchContacts])

  useEffect(() => {
    const sub = supabase
      .channel('contacts_sidebar')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whatsapp_contacts',
          filter: `instance_id=eq.${instanceId}`,
        },
        () => fetchContacts(search),
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whatsapp_conversation_status',
          filter: `instance_id=eq.${instanceId}`,
        },
        () => fetchContacts(search),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(sub)
    }
  }, [instanceId, search, fetchContacts])

  const getStatusInfo = (c: any) => {
    const s = Array.isArray(c.whatsapp_conversation_status)
      ? c.whatsapp_conversation_status[0]
      : c.whatsapp_conversation_status
    return { unread: s?.unread_count || 0, status: s?.status || 'nova' }
  }

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas..."
            className="pl-9 bg-card-secondary border-transparent focus-visible:ring-primary"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="p-4 space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
            <User className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">Nenhuma conversa encontrada</p>
          </div>
        ) : (
          <div className="flex flex-col p-2 space-y-1">
            {contacts.map((c) => {
              const { unread, status } = getStatusInfo(c)
              return (
                <button
                  key={c.id}
                  onClick={() => onSelect(c.id)}
                  className={cn(
                    'flex items-center text-left p-3 rounded-lg transition-colors group',
                    selectedContactId === c.id
                      ? 'bg-primary/10 text-foreground'
                      : 'hover:bg-card-secondary text-foreground',
                  )}
                >
                  <Avatar className="h-10 w-10 mr-3 border border-border">
                    <AvatarImage src={c.profile_picture_url || ''} />
                    <AvatarFallback className="bg-card-secondary text-xs">
                      {c.push_name?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm truncate pr-2">
                        {c.push_name || c.phone_number || formatJid(c.remote_jid)}
                      </span>
                      <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                        {safeFormatTime(c.last_message_at)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={cn(
                          'text-xs truncate w-full',
                          unread > 0 ? 'text-foreground font-medium' : 'text-muted-foreground',
                        )}
                      >
                        {status === 'nova' ? 'Nova conversa' : 'Ver mensagens...'}
                      </span>
                      {unread > 0 && (
                        <Badge className="ml-2 bg-primary hover:bg-primary text-primary-foreground h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full text-[10px] shadow-none border-none">
                          {unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
