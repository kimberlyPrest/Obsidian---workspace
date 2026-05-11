import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { ToneModal } from '@/components/whatsapp-config/ToneModal'
import { Badge } from '@/components/ui/badge'

export function ToneOfVoiceTab() {
  const [tones, setTones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTone, setSelectedTone] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchTones = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('tone_of_voice')
        .select('*, clients(name)')
        .order('created_at', { ascending: false })
      if (error) throw error
      setTones(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTones()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tone of Voice</h2>
        <Button
          onClick={() => {
            setSelectedTone(null)
            setModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Tone
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-lg">
          <p>{error}</p>
          <Button variant="outline" onClick={fetchTones} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" /> Tentar Novamente
          </Button>
        </div>
      ) : tones.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground border rounded-lg bg-card/50">
          <MessageCircle className="h-8 w-8 mx-auto mb-4 opacity-50" />
          <p>Nenhum tone of voice configurado</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tones.map((tone) => (
            <div
              key={tone.id}
              className="p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors cursor-pointer flex justify-between items-center"
              onClick={() => {
                setSelectedTone(tone)
                setModalOpen(true)
              }}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-lg capitalize">{tone.scope.replace('_', ' ')}</h3>
                  {tone.clients && <Badge variant="outline">Client: {tone.clients.name}</Badge>}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span>Exemplos: {tone.total_examples}</span>
                  {tone.last_refined_at && (
                    <span> • Refinado: {format(new Date(tone.last_refined_at), 'dd/MM/yyyy')}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToneModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        tone={selectedTone}
        onSuccess={fetchTones}
      />
    </div>
  )
}
