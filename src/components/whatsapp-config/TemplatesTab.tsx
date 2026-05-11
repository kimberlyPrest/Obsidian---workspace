import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Plus, RefreshCw, FileText } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { TemplateModal } from '@/components/whatsapp-config/TemplateModal'
import { Badge } from '@/components/ui/badge'

export function TemplatesTab() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchTemplates = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('whatsapp_templates_semanticos')
        .select('*')
        .order('total_uses', { ascending: false })
      if (error) throw error
      setTemplates(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplates()
  }, [])

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Templates Semânticos</h2>
        <Button
          onClick={() => {
            setSelectedTemplate(null)
            setModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Template
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
          <Button variant="outline" onClick={fetchTemplates} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" /> Tentar Novamente
          </Button>
        </div>
      ) : templates.length === 0 ? (
        <div className="p-12 text-center text-muted-foreground border rounded-lg bg-card/50">
          <FileText className="h-8 w-8 mx-auto mb-4 opacity-50" />
          <p>Nenhum template encontrado</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 border rounded-lg bg-card hover:border-primary/50 transition-colors cursor-pointer flex flex-col space-y-2"
              onClick={() => {
                setSelectedTemplate(tpl)
                setModalOpen(true)
              }}
            >
              <div className="flex justify-between items-start">
                <p className="font-medium line-clamp-2 w-3/4">{tpl.template_text}</p>
                {tpl.auto_send_enabled && <Badge variant="default">Auto-Send</Badge>}
              </div>
              <div className="text-sm text-muted-foreground flex space-x-4">
                <span>
                  Scope: <span className="capitalize">{tpl.tone_scope.replace('_', ' ')}</span>
                </span>
                <span>Usos: {tpl.total_uses}</span>
                <span>Aprovações: {tpl.consecutive_approvals}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <TemplateModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        template={selectedTemplate}
        onSuccess={fetchTemplates}
      />
    </div>
  )
}
