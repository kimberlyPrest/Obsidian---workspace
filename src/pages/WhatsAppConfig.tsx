import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InstancesTab } from '@/components/whatsapp-config/InstancesTab'
import { ToneOfVoiceTab } from '@/components/whatsapp-config/ToneOfVoiceTab'
import { TemplatesTab } from '@/components/whatsapp-config/TemplatesTab'
import { HolidaysTab } from '@/components/whatsapp-config/HolidaysTab'

export default function WhatsAppConfig() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-heading font-bold text-foreground">Configurações WhatsApp</h1>
        <p className="text-muted-foreground mt-2">
          Gerencie instâncias da Evolution API, estilos de comunicação, templates e feriados.
        </p>
      </div>

      <Tabs defaultValue="instances" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="instances">Instâncias</TabsTrigger>
          <TabsTrigger value="tone">Tone of Voice</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="holidays">Feriados</TabsTrigger>
        </TabsList>

        <TabsContent value="instances">
          <InstancesTab />
        </TabsContent>
        <TabsContent value="tone">
          <ToneOfVoiceTab />
        </TabsContent>
        <TabsContent value="templates">
          <TemplatesTab />
        </TabsContent>
        <TabsContent value="holidays">
          <HolidaysTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
