import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw, CalendarDays } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { HolidayModal } from '@/components/whatsapp-config/HolidayModal'
import { Badge } from '@/components/ui/badge'

export function HolidaysTab() {
  const [holidays, setHolidays] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedHoliday, setSelectedHoliday] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchHolidays = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .order('date', { ascending: true })
      if (error) throw error
      setHolidays(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHolidays()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Feriados e Pausas</h2>
        <Button
          onClick={() => {
            setSelectedHoliday(null)
            setModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Feriado
        </Button>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : error ? (
        <div className="p-8 text-center text-red-500 bg-red-500/10 rounded-lg">
          <p>{error}</p>
          <Button variant="outline" onClick={fetchHolidays} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" /> Tentar Novamente
          </Button>
        </div>
      ) : holidays.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground border rounded-lg bg-card/50">
          <CalendarDays className="h-8 w-8 mx-auto mb-4 opacity-50" />
          <p>Nenhum feriado cadastrado</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {holidays.map((hol) => (
            <div
              key={hol.id}
              className="p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors cursor-pointer flex justify-between items-center"
              onClick={() => {
                setSelectedHoliday(hol)
                setModalOpen(true)
              }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-24 text-primary font-semibold">
                  {format(parseISO(hol.date), 'dd/MM/yyyy')}
                </div>
                <div className="font-medium">{hol.name}</div>
              </div>
              <div className="flex space-x-2">
                <Badge variant="outline" className="capitalize">
                  {hol.scope === 'national' ? 'Nacional' : `Regional (${hol.region})`}
                </Badge>
                {hol.is_manual && <Badge variant="secondary">Manual</Badge>}
              </div>
            </div>
          ))}
        </div>
      )}

      <HolidayModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        holiday={selectedHoliday}
        onSuccess={fetchHolidays}
      />
    </div>
  )
}
