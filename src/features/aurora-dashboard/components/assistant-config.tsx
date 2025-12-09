import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCustomerAssistants } from '@/hooks/use-customer-assistants'
import { Badge } from '@/components/ui/badge'
import { Settings, Wrench, MessageSquare, Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AssistantConfig() {
  const { assistants, loading, error, refresh, hasApiKey } = useCustomerAssistants()

  if (!hasApiKey) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Assistant Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p>VAPI API key not configured</p>
            <p className="text-xs mt-2">
              Please configure the VAPI API key in environment variables (VITE_VAPI_API_KEY) or localStorage.
              <br />
              The API key is global for all dashboards.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading && assistants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Assistant Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            <p>Loading assistant configurations...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (assistants.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Assistant Configuration
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={refresh} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No assistant configuration found</p>
            <p className="text-xs mt-2">Make sure you have agents configured in your customer settings</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Assistant Configuration ({assistants.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={refresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {assistants.map((assistant) => {
          const tools = assistant.model?.tools || []
          const systemMessage = assistant.model?.systemMessage || 'No system message configured'

          return (
            <div key={assistant.id} className="border rounded-lg p-4 space-y-4">
              {/* Assistant Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">
                      {assistant.name || `Assistant ${assistant.id.slice(0, 8)}`}
                    </h3>
                    <Badge variant="outline" className="font-mono text-xs">
                      {assistant.id}
                    </Badge>
                  </div>
                  {assistant.error && (
                    <div className="flex items-center gap-2 text-sm text-destructive mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <span>{assistant.error}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* System Prompt */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm">
                  <MessageSquare className="h-4 w-4" />
                  System Prompt
                </h4>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap">{systemMessage}</p>
                </div>
              </div>

              {/* Integrated Tools */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm">
                  <Wrench className="h-4 w-4" />
                  Integrated Tools ({tools.length})
                </h4>
                {tools.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No tools configured</p>
                ) : (
                  <div className="grid gap-2 md:grid-cols-2">
                    {tools.map((tool, idx) => (
                      <div key={idx} className="border rounded-lg p-3 bg-muted/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {tool.function?.name || tool.type || 'Unknown'}
                          </Badge>
                          {tool.type && tool.type !== tool.function?.name && (
                            <span className="text-xs text-muted-foreground">({tool.type})</span>
                          )}
                        </div>
                        {tool.function?.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {tool.function.description}
                          </p>
                        )}
                        {tool.function?.parameters && (
                          <details className="mt-2">
                            <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                              View parameters
                            </summary>
                            <pre className="text-xs mt-2 bg-background p-2 rounded overflow-x-auto">
                              {JSON.stringify(tool.function.parameters, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Assistant Info */}
              {assistant.model && (
                <div className="pt-2 border-t">
                  <details className="text-xs">
                    <summary className="text-muted-foreground cursor-pointer hover:text-foreground">
                      View full configuration
                    </summary>
                    <pre className="mt-2 bg-muted p-3 rounded overflow-x-auto text-xs">
                      {JSON.stringify(assistant, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
