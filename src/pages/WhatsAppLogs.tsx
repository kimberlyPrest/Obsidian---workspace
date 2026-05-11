import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Charts } from '@/components/whatsapp-logs/Charts'
import { WebhookLogTab } from '@/components/whatsapp-logs/WebhookLogTab'
import { AutomationLogTab } from '@/components/whatsapp-logs/AutomationLogTab'
import { ResponseMetricsTab } from '@/components/whatsapp-logs/ResponseMetricsTab'

export default function WhatsAppLogs() {
  return (
    <div className="space-y-6 flex flex-col">
      <div>
        <h1 className="text-3xl font-heading font-bold">Logs e Métricas</h1>
        <p className="text-muted-foreground mt-2">
          Monitore a saúde, performance e integrações do seu módulo WhatsApp.
        </p>
      </div>

      <Charts />

      <Tabs defaultValue="webhook" className="flex flex-col">
        <TabsList className="w-fit">
          <TabsTrigger value="webhook">Webhook Log</TabsTrigger>
          <TabsTrigger value="automation">Automation Log</TabsTrigger>
          <TabsTrigger value="metrics">Response Metrics</TabsTrigger>
        </TabsList>
        <div className="mt-4 h-[600px]">
          <TabsContent value="webhook" className="h-full m-0 data-[state=active]:flex flex-col">
            <WebhookLogTab />
          </TabsContent>
          <TabsContent value="automation" className="h-full m-0 data-[state=active]:flex flex-col">
            <AutomationLogTab />
          </TabsContent>
          <TabsContent value="metrics" className="h-full m-0 data-[state=active]:flex flex-col">
            <ResponseMetricsTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
