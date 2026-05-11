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
import { Loader2, Plus, ServerCrash, RefreshCcw, CalendarDays } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { HolidayModal } from './HolidayModal'

export function HolidaysTab() {
  const [holidays, setHolidays] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedHoliday, setSelectedHoliday] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('holidays')
      .select('*')
      .order('date', { ascending: true })
      .limit(50)
    if (error) setError(error.message)
    else setHolidays(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleEdit = (h: any) => {
    setSelectedHoliday(h)
    setIsModalOpen(true)
  }
  const handleCreate = () => {
    setSelectedHoliday(null)
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
        <div>
          <h2 className="text-xl font-semibold flex items-center">
            <CalendarDays className="h-5 w-5 mr-2 text-primary" /> Calendário de Feriados
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Defina feriados para ajustes automáticos no horário de atendimento.
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> Cadastrar Feriado
        </Button>
      </div>

      {!holidays.length ? (
        <div className="text-center p-12 bg-muted/30 rounded-lg border border-dashed">
          <p className="text-muted-foreground mb-4">Sua agenda de feriados está vazia.</p>
          <Button onClick={handleCreate} variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Registrar o primeiro Feriado
          </Button>
        </div>
      ) : (
        <div className="border rounded-md bg-background overflow-hidden mt-4">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Data do Feriado</TableHead>
                <TableHead>Descrição / Nome</TableHead>
                <TableHead>Escopo</TableHead>
                <TableHead>Região (Opcional)</TableHead>
                <TableHead>Inserção</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holidays.map((h) => (
                <TableRow
                  key={h.id}
                  onClick={() => handleEdit(h)}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-semibold text-primary">
                    {format(new Date(h.date + 'T12:00:00Z'), "dd 'de' MMMM, yyyy", {
                      locale: ptBR,
                    })}
                  </TableCell>
                  <TableCell className="font-medium">{h.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {h.scope}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{h.region || 'Brasil'}</TableCell>
                  <TableCell>
                    {h.is_manual ? (
                      <Badge variant="secondary">Manual</Badge>
                    ) : (
                      <Badge
                        variant="default"
                        className="bg-primary/20 text-primary hover:bg-primary/30"
                      >
                        Sistema
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <HolidayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        holiday={selectedHoliday}
        onSaved={loadData}
      />
    </div>
  )
}
