import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, Plus, ServerCrash, RefreshCcw } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ToneOfVoiceModal } from './ToneOfVoiceModal'

export function ToneOfVoiceTab() {
  const [tones, setTones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTone, setSelectedTone] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('tone_of_voice')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    if (error) setError(error.message)
    else setTones(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleEdit = (tone: any) => {
    setSelectedTone(tone)
    setIsModalOpen(true)
  }
  const handleCreate = () => {
    setSelectedTone(null)
    setIsModalOpen(true)
  }

  if (loading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  if (error)
    return (
      <div className="text-center p-12 text-destructive">
        <ServerCrash className="h-8 w-8 mx-auto mb-3" />
        <p>{error}</p>
        <Button variant="outline" onClick={loadData} className="mt-4">
          <RefreshCcw className="w-4 h-4 mr-2" /> Tentar Novamente
        </Button>
      </div>
    )

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Diretrizes de Tone of Voice</h2>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> Criar Diretriz
        </Button>
      </div>

      {!tones.length ? (
        <div className="text-center p-12 bg-muted/30 rounded-lg border border-dashed">
          <p className="text-muted-foreground mb-4">
            Nenhum perfil de Tone of Voice configurado ainda.
          </p>
          <Button onClick={handleCreate} variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Criar o primeiro Perfil
          </Button>
        </div>
      ) : (
        <div className="border rounded-md bg-background overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Escopo de Atuação</TableHead>
                <TableHead>Client ID</TableHead>
                <TableHead>Exemplos de Treino</TableHead>
                <TableHead>Última Calibragem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tones.map((tone) => (
                <TableRow
                  key={tone.id}
                  onClick={() => handleEdit(tone)}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium text-primary capitalize">
                    {tone.scope.replace('_', ' ')}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{tone.client_id || 'Global'}</TableCell>
                  <TableCell>{tone.total_examples || 0} exemplos</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {tone.last_refined_at
                      ? format(new Date(tone.last_refined_at), "dd/MM/yy 'às' HH:mm", {
                          locale: ptBR,
                        })
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ToneOfVoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tone={selectedTone}
        onSaved={loadData}
      />
    </div>
  )
}
