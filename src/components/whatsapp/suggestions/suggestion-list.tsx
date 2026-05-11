import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { SuggestionDetailModal } from './suggestion-detail-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Inbox, MessageSquare, AlertCircle } from 'lucide-react'

export function SuggestionList({
  status,
  search,
  contactId,
}: {
  status: string
  search: string
  contactId: string | null
}) {
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSuggestion, setSelectedSuggestion] = useState<any | null>(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const PAGE_SIZE = 20

  const fetchSuggestions = async (isLoadMore = false) => {
    if (!isLoadMore) {
      setLoading(true)
      setPage(0)
    }
    setError(null)

    try {
      let query = supabase
        .from('whatsapp_suggestions')
        .select(
          `
          *,
          contact:whatsapp_contacts(id, push_name, display_name, phone_number, profile_picture_url, instance_id),
          trigger_message:whatsapp_messages!whatsapp_suggestions_trigger_message_id_fkey(id, content, media_url, media_type)
        `,
          { count: 'exact' },
        )
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (contactId) {
        query = query.eq('contact_id', contactId)
      }

      const from = (isLoadMore ? page + 1 : 0) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      query = query.range(from, to)

      const { data, error: fetchError, count } = await query

      if (fetchError) throw fetchError

      let finalData = data || []

      if (search) {
        finalData = finalData.filter((s) => {
          const name =
            s.contact?.push_name || s.contact?.display_name || s.contact?.phone_number || ''
          return name.toLowerCase().includes(search.toLowerCase())
        })
      }

      if (isLoadMore) {
        setSuggestions((prev) => [...prev, ...finalData])
        setPage((p) => p + 1)
      } else {
        setSuggestions(finalData)
      }

      setHasMore(count ? from + PAGE_SIZE < count : false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuggestions()

    const sub = supabase
      .channel(`suggestions_${status}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'whatsapp_suggestions',
          filter: `status=eq.${status}`,
        },
        () => {
          fetchSuggestions()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(sub)
    }
  }, [status, search, contactId])

  if (loading && suggestions.length === 0) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-4 p-4 border border-border rounded-lg bg-card-secondary/50"
          >
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
        <AlertCircle className="h-8 w-8 mb-2 text-destructive" />
        <p>Erro ao carregar sugestões</p>
        <Button
          variant="outline"
          className="mt-4 border-border hover:bg-card-secondary"
          onClick={() => fetchSuggestions()}
        >
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (suggestions.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-60">
        <Inbox className="h-12 w-12 mb-4" />
        <p>
          Nenhuma sugestão{' '}
          {status === 'pending' ? 'pendente' : status === 'approved' ? 'aprovada' : 'rejeitada'}
        </p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3">
      {suggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className="flex flex-col sm:flex-row gap-4 p-4 border border-border rounded-lg bg-card hover:bg-card-secondary transition-colors cursor-pointer group"
          onClick={() => setSelectedSuggestion(suggestion)}
        >
          <Avatar className="h-12 w-12 border border-border">
            <AvatarImage src={suggestion.contact?.profile_picture_url || ''} />
            <AvatarFallback className="bg-card-secondary text-muted-foreground">
              {suggestion.contact?.push_name?.substring(0, 2).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-foreground truncate pr-2">
                {suggestion.contact?.push_name ||
                  suggestion.contact?.display_name ||
                  suggestion.contact?.phone_number ||
                  suggestion.remote_jid}
              </h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {format(new Date(suggestion.created_at), 'dd/MM HH:mm')}
              </span>
            </div>

            <div className="text-sm text-muted-foreground mb-2 flex items-start gap-2">
              <MessageSquare className="h-4 w-4 shrink-0 mt-0.5 opacity-50" />
              <p className="truncate">{suggestion.trigger_message?.content || 'Mídia / Outro'}</p>
            </div>

            <div className="text-sm font-medium text-foreground bg-card-secondary p-3 rounded-md border border-border line-clamp-2">
              {suggestion.final_text || suggestion.suggested_text}
            </div>
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="pt-4 pb-2 flex justify-center">
          <Button
            variant="outline"
            className="border-border bg-card hover:bg-card-secondary"
            onClick={() => fetchSuggestions(true)}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Carregar mais'}
          </Button>
        </div>
      )}

      {selectedSuggestion && (
        <SuggestionDetailModal
          suggestion={selectedSuggestion}
          open={!!selectedSuggestion}
          onOpenChange={(open: boolean) => !open && setSelectedSuggestion(null)}
          onSuccess={() => {
            setSelectedSuggestion(null)
            fetchSuggestions()
          }}
        />
      )}
    </div>
  )
}
