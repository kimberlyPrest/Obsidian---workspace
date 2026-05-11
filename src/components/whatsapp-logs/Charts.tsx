import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid } from 'recharts'
import { subDays, format, startOfDay } from 'date-fns'

export function Charts() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function load() {
      const start = startOfDay(subDays(new Date(), 6))
      const [msgRes, metricsRes, webhookRes] = await Promise.all([
        supabase
          .from('whatsapp_messages')
          .select('created_at, direction')
          .gte('created_at', start.toISOString()),
        supabase
          .from('whatsapp_response_metrics')
          .select('inbound_at, raw_minutes, business_hours_minutes')
          .gte('inbound_at', start.toISOString()),
        supabase
          .from('evolution_webhook_log')
          .select('received_at, error')
          .gte('received_at', start.toISOString()),
      ])

      const days = Array.from({ length: 7 }).map((_, i) =>
        format(subDays(new Date(), 6 - i), 'yyyy-MM-dd'),
      )

      const chartData = days.map((day) => {
        const msgs = msgRes.data?.filter((m) => m.created_at.startsWith(day)) || []
        const mets = metricsRes.data?.filter((m) => m.inbound_at.startsWith(day)) || []
        const hooks = webhookRes.data?.filter((m) => m.received_at.startsWith(day)) || []

        const inbound = msgs.filter((m) => m.direction === 'inbound').length
        const outbound = msgs.filter((m) => m.direction === 'outbound').length
        const avgRaw = mets.length
          ? mets.reduce((acc, m) => acc + (m.raw_minutes || 0), 0) / mets.length
          : 0
        const avgBh = mets.length
          ? mets.reduce((acc, m) => acc + (m.business_hours_minutes || 0), 0) / mets.length
          : 0
        const errors = hooks.filter((m) => m.error).length
        const errorRate = hooks.length ? (errors / hooks.length) * 100 : 0

        return {
          date: format(new Date(day), 'dd/MM'),
          inbound,
          outbound,
          avgRaw: Math.round(avgRaw),
          avgBh: Math.round(avgBh),
          errorRate: Math.round(errorRate * 100) / 100,
        }
      })
      setData(chartData)
    }
    load()
  }, [])

  if (!data) return <div className="h-64 animate-pulse bg-card rounded-xl border border-border" />

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Volume de Mensagens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ChartContainer
              config={{
                inbound: { label: 'Recebidas', color: 'hsl(var(--primary))' },
                outbound: { label: 'Enviadas', color: 'hsl(var(--chart-2))' },
              }}
            >
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="inbound"
                  stroke="var(--color-inbound)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="outbound"
                  stroke="var(--color-outbound)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Tempo de Resposta Médio (min)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ChartContainer
              config={{
                avgRaw: { label: 'Tempo Bruto', color: 'hsl(var(--chart-3))' },
                avgBh: { label: 'Tempo Útil', color: 'hsl(var(--chart-4))' },
              }}
            >
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="avgRaw" fill="var(--color-avgRaw)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgBh" fill="var(--color-avgBh)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Taxa de Erro Webhooks (%)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ChartContainer
              config={{ errorRate: { label: 'Erros %', color: 'hsl(var(--destructive))' } }}
            >
              <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="errorRate"
                  stroke="var(--color-errorRate)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
