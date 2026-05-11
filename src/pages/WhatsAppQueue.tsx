import { useState, useEffect, useCallback } from 'react'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Search,
  Clock,
  Loader2,
  RefreshCw,
  AlertCircle,
  X,
  CheckCheck,
  Check,
  SendHorizontal,
} from 'lucide-react'

import { supabase } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { QueueModal } from '@/components/whatsapp/QueueModal'

export default function WhatsAppQueue() {
  const [activeTab, setActiveTab] = useState('agendadas')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<any | null>(null)

  const { toast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('whatsapp_outbound_queue')
        .select(
          `*, contact:whatsapp_contacts${debouncedSearch ? '!inner' : ''}(id, push_name, display_name, phone_number)`,
        )
        .limit(20)

      if (activeTab === 'agendadas') {
        query = query
          .in('status', ['scheduled', 'sending', 'retrying'])
          .order('scheduled_at', { ascending: true })
      } else if (activeTab === 'enviadas') {
        query = query
          .eq('status', 'sent')
          .is('delivered_at', null)
          .is('read_at', null)
          .order('sent_at', { ascending: false })
      } else if (activeTab === 'entregues') {
        query = query
          .eq('status', 'sent')
          .not('delivered_at', 'is', null)
          .is('read_at', null)
          .order('sent_at', { ascending: false })
      } else if (activeTab === 'lidas') {
        query = query
          .eq('status', 'sent')
          .not('read_at', 'is', null)
          .order('sent_at', { ascending: false })
      } else if (activeTab === 'erros') {
        query = query
          .in('status', ['failed', 'cancelled'])
          .order('scheduled_at', { ascending: false })
      }

      if (debouncedSearch) {
        query = query.or(
          `display_name.ilike.%${debouncedSearch}%,push_name.ilike.%${debouncedSearch}%,phone_number.ilike.%${debouncedSearch}%`,
          { foreignTable: 'contact' },
        )
      }

      const { data, error } = await query
      if (error) throw error
      setItems(data || [])
    } catch (error: any) {
      console.error(error)
      toast({ variant: 'destructive', description: 'Erro ao carregar fila: ' + error.message })
    } finally {
      setLoading(false)
    }
  }, [activeTab, debouncedSearch, toast])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  useEffect(() => {
    const channel = supabase
      .channel('queue_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'whatsapp_outbound_queue' },
        () => fetchItems(),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchItems])

  const getContactName = (contact: any) =>
    contact?.display_name || contact?.push_name || contact?.phone_number || 'Desconhecido'

  const getStatusBadge = (status: string, item?: any) => {
    if (status === 'scheduled')
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          <Clock className="w-3 h-3 mr-1" /> Agendada
        </Badge>
      )
    if (status === 'sending')
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Enviando
        </Badge>
      )
    if (status === 'retrying')
      return (
        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
          <RefreshCw className="w-3 h-3 mr-1" /> Retentando
        </Badge>
      )
    if (status === 'failed')
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
          <AlertCircle className="w-3 h-3 mr-1" /> Falhou
        </Badge>
      )
    if (status === 'cancelled')
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
          <X className="w-3 h-3 mr-1" /> Cancelada
        </Badge>
      )
    if (status === 'sent') {
      if (item?.read_at)
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <CheckCheck className="w-3 h-3 mr-1" /> Lida
          </Badge>
        )
      if (item?.delivered_at)
        return (
          <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
            <CheckCheck className="w-3 h-3 mr-1" /> Entregue
          </Badge>
        )
      return (
        <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
          <Check className="w-3 h-3 mr-1" /> Enviada
        </Badge>
      )
    }
    return <Badge>{status}</Badge>
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight font-heading">Fila de Envios</h2>
          <p className="text-muted-foreground">
            Gerencie as mensagens agendadas e enviadas do WhatsApp
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:max-w-2xl">
          <TabsList className="grid w-full grid-cols-5 h-auto py-1 bg-card border border-border">
            <TabsTrigger
              value="agendadas"
              className="text-xs sm:text-sm py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Agendadas
            </TabsTrigger>
            <TabsTrigger
              value="enviadas"
              className="text-xs sm:text-sm py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Enviadas
            </TabsTrigger>
            <TabsTrigger
              value="entregues"
              className="text-xs sm:text-sm py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Entregues
            </TabsTrigger>
            <TabsTrigger
              value="lidas"
              className="text-xs sm:text-sm py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Lidas
            </TabsTrigger>
            <TabsTrigger
              value="erros"
              className="text-xs sm:text-sm py-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
            >
              Erros
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar contato..."
            className="pl-9 bg-card border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-card rounded-xl border border-border shadow-sm">
        {loading ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg bg-card-secondary" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <SendHorizontal className="h-12 w-12 mb-4 opacity-20" />
            <p>Nenhuma mensagem encontrada nesta aba</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-card-secondary transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground truncate">
                      {getContactName(item.contact)}
                    </span>
                    {getStatusBadge(item.status, item)}
                    <Badge
                      variant="secondary"
                      className="text-[10px] hidden sm:inline-flex border-border bg-background uppercase tracking-wider"
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {item.content || `[Mídia: ${item.media_type}]`}
                  </p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-xs text-muted-foreground flex items-center gap-1 sm:justify-end">
                    <Clock className="w-3 h-3" />
                    {item.scheduled_at &&
                      format(parseISO(item.scheduled_at), 'dd/MM HH:mm', { locale: ptBR })}
                  </div>
                  {item.attempts > 0 && (
                    <div className="text-xs text-yellow-500 mt-1">{item.attempts} tentativa(s)</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <QueueModal
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        onSuccess={() => {
          setSelectedItem(null)
          fetchItems()
        }}
      />
    </div>
  )
}
