import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InstancesTab } from '@/components/whatsapp/settings/InstancesTab'
import { ToneOfVoiceTab } from '@/components/whatsapp/settings/ToneOfVoiceTab'
import { TemplatesTab } from '@/components/whatsapp/settings/TemplatesTab'
import { HolidaysTab } from '@/components/whatsapp/settings/HolidaysTab'

export default function WhatsAppSettings() {
  return (
    <div className="flex flex-col h-full space-y-6 animate-fade-in-up duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações do WhatsApp</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie instâncias, diretrizes de tom de voz, templates semânticos e calendários de
            feriados.
          </p>
        </div>
      </div>

      <Tabs defaultValue="instances" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent mb-4">
          <TabsTrigger
            value="instances"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3"
          >
            Instâncias Evolution
          </TabsTrigger>
          <TabsTrigger
            value="tone"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3"
          >
            Tone of Voice
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3"
          >
            Templates Semânticos
          </TabsTrigger>
          <TabsTrigger
            value="holidays"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent rounded-none px-6 py-3"
          >
            Feriados
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 bg-card rounded-md border p-6 overflow-y-auto shadow-sm">
          <TabsContent value="instances" className="m-0 h-full">
            <InstancesTab />
          </TabsContent>
          <TabsContent value="tone" className="m-0 h-full">
            <ToneOfVoiceTab />
          </TabsContent>
          <TabsContent value="templates" className="m-0 h-full">
            <TemplatesTab />
          </TabsContent>
          <TabsContent value="holidays" className="m-0 h-full">
            <HolidaysTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
