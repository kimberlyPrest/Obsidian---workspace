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
import { Badge } from '@/components/ui/badge'
import { TemplateModal } from './TemplateModal'

export function TemplatesTab() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from('whatsapp_templates_semanticos')
      .select('*')
      .order('total_uses', { ascending: false })
      .limit(30)
    if (error) setError(error.message)
    else setTemplates(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleEdit = (tpl: any) => {
    setSelectedTemplate(tpl)
    setIsModalOpen(true)
  }
  const handleCreate = () => {
    setSelectedTemplate(null)
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
        <h2 className="text-xl font-semibold">Base de Conhecimento e Templates</h2>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" /> Adicionar Template
        </Button>
      </div>

      {!templates.length ? (
        <div className="text-center p-12 bg-muted/30 rounded-lg border border-dashed">
          <p className="text-muted-foreground mb-4">
            A base ainda não possui templates semânticos.
          </p>
          <Button onClick={handleCreate} variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Adicionar Primeiro Template
          </Button>
        </div>
      ) : (
        <div className="border rounded-md bg-background overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-2/5">Mensagem Base</TableHead>
                <TableHead>Tone Scope</TableHead>
                <TableHead className="text-center">Usos Efetuados</TableHead>
                <TableHead className="text-center">Aprovações</TableHead>
                <TableHead>Automação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((tpl) => (
                <TableRow
                  key={tpl.id}
                  onClick={() => handleEdit(tpl)}
                  className="cursor-pointer transition-colors hover:bg-muted/50"
                >
                  <TableCell className="max-w-[250px]">
                    <p className="truncate font-medium" title={tpl.template_text}>
                      {tpl.template_text}
                    </p>
                    {tpl.trigger_pattern && (
                      <p className="text-xs text-muted-foreground mt-1 font-mono truncate bg-muted inline-block px-1 rounded">
                        RegEx: {tpl.trigger_pattern}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="capitalize">{tpl.tone_scope.replace('_', ' ')}</TableCell>
                  <TableCell className="text-center font-medium">{tpl.total_uses || 0}</TableCell>
                  <TableCell className="text-center text-emerald-600 font-medium">
                    {tpl.consecutive_approvals || 0}
                  </TableCell>
                  <TableCell>
                    {tpl.auto_send_enabled ? (
                      <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-600">
                        Ativo
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inativo</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        template={selectedTemplate}
        onSaved={loadData}
      />
    </div>
  )
}
