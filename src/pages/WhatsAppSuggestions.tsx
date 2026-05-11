import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { SuggestionList } from '@/components/whatsapp/suggestions/suggestion-list'
import { Search, Lightbulb } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

export default function WhatsAppSuggestions() {
  const [searchParams] = useSearchParams()
  const contactIdParam = searchParams.get('contactId')

  const [activeTab, setActiveTab] = useState('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 300)

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] p-4 sm:p-6 gap-6 bg-background animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-warning/10 rounded-lg">
            <Lightbulb className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Sugestões de Resposta
            </h1>
            <p className="text-sm text-muted-foreground hidden sm:block">
              Revise e aprove as mensagens sugeridas pela IA
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col flex-1 bg-card border border-border rounded-lg overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex flex-col h-full w-full"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-b border-border gap-4">
            <TabsList className="bg-card-secondary w-full sm:w-auto h-auto p-1 flex-wrap sm:flex-nowrap">
              <TabsTrigger
                value="pending"
                className="flex-1 sm:flex-none data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                Pendentes
              </TabsTrigger>
              <TabsTrigger
                value="approved"
                className="flex-1 sm:flex-none data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                Aprovadas
              </TabsTrigger>
              <TabsTrigger
                value="rejected"
                className="flex-1 sm:flex-none data-[state=active]:bg-card data-[state=active]:text-foreground"
              >
                Rejeitadas
              </TabsTrigger>
            </TabsList>

            <div className="relative w-full sm:w-72 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por contato..."
                className="pl-9 bg-card-secondary border-border focus-visible:ring-primary text-foreground"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-hidden relative">
            <TabsContent value="pending" className="m-0 h-full data-[state=inactive]:hidden">
              <SuggestionList
                status="pending"
                search={debouncedSearch}
                contactId={contactIdParam}
              />
            </TabsContent>
            <TabsContent value="approved" className="m-0 h-full data-[state=inactive]:hidden">
              <SuggestionList
                status="approved"
                search={debouncedSearch}
                contactId={contactIdParam}
              />
            </TabsContent>
            <TabsContent value="rejected" className="m-0 h-full data-[state=inactive]:hidden">
              <SuggestionList
                status="rejected"
                search={debouncedSearch}
                contactId={contactIdParam}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
