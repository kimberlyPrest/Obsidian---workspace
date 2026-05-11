import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ContactsSidebar } from '@/components/whatsapp/contacts-sidebar'
import { ChatArea } from '@/components/whatsapp/chat-area'
import { ContactDetails } from '@/components/whatsapp/contact-details'
import { useIsMobile } from '@/hooks/use-mobile'
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { MessageSquare } from 'lucide-react'

export default function WhatsAppModule() {
  const [instanceId, setInstanceId] = useState<string | null>(null)
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [showMobileContacts, setShowMobileContacts] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    supabase
      .from('evolution_instances')
      .select('id')
      .eq('status', 'connected')
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setInstanceId(data.id)
      })
  }, [])

  const handleSelectContact = (id: string) => {
    setSelectedContactId(id)
    if (isMobile) setShowMobileContacts(false)
  }

  if (!instanceId)
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center animate-fade-in-up">
        <div className="text-muted-foreground flex flex-col items-center">
          <MessageSquare className="h-8 w-8 mb-2 animate-pulse" />
          <p>Conectando ao WhatsApp...</p>
        </div>
      </div>
    )

  return (
    <div className="flex h-[calc(100vh-4rem)] border border-border rounded-lg overflow-hidden bg-card animate-fade-in-up">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="w-[300px] border-r border-border flex flex-col bg-card shrink-0">
          <ContactsSidebar
            instanceId={instanceId}
            selectedContactId={selectedContactId}
            onSelect={handleSelectContact}
          />
        </div>
      )}

      {/* Mobile Contacts Sheet */}
      {isMobile && (
        <Sheet open={showMobileContacts} onOpenChange={setShowMobileContacts}>
          <SheetContent side="left" className="p-0 w-[300px] border-border bg-card">
            <SheetTitle className="sr-only">Contatos</SheetTitle>
            <SheetDescription className="sr-only">Lista de conversas do WhatsApp</SheetDescription>
            <ContactsSidebar
              instanceId={instanceId}
              selectedContactId={selectedContactId}
              onSelect={handleSelectContact}
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background relative">
        {selectedContactId ? (
          <ChatArea
            instanceId={instanceId}
            contactId={selectedContactId}
            onOpenContacts={() => setShowMobileContacts(true)}
            onToggleDetails={() => setShowDetails(!showDetails)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground flex-col bg-background">
            <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
            <p className="text-sm">Selecione uma conversa para começar</p>
          </div>
        )}
      </div>

      {/* Desktop Details */}
      {!isMobile && selectedContactId && showDetails && (
        <div className="w-[350px] border-l border-border flex flex-col bg-card shrink-0">
          <ContactDetails instanceId={instanceId} contactId={selectedContactId} />
        </div>
      )}

      {/* Mobile Details Sheet */}
      {isMobile && selectedContactId && (
        <Sheet open={showDetails} onOpenChange={setShowDetails}>
          <SheetContent side="right" className="p-0 w-full sm:w-[350px] border-border bg-card">
            <SheetTitle className="sr-only">Detalhes do Contato</SheetTitle>
            <SheetDescription className="sr-only">
              Informações da conversa selecionada
            </SheetDescription>
            <ContactDetails instanceId={instanceId} contactId={selectedContactId} />
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}
