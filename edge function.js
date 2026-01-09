import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// CONFIGURATION
// Ton URL Supabase spécifique
const SUPABASE_URL = 'https://oknakvgnwxlkvhwmocno.supabase.co'

// IMPORTANT : Récupère la "service_role" key dans Project Settings > API
// Ne l'écris pas en dur ici si possible, utilise: supabase secrets set SUPABASE_SERVICE_ROLE_KEY=...
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || 'Ta_Service_Role_Key_Ici'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (req) => {
  // 1. Gestion des CORS (si nécessaire pour des appels navigateur, optionnel pour n8n)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    // 2. Récupération du Payload envoyé par n8n
    const payload = await req.json()

    if (!Array.isArray(payload) || payload.length === 0) {
      throw new Error("Format de payload invalide : Un tableau est attendu.")
    }

    // Handle different payload structures from n8n
    // Structure 1: Direct transfer request [{ "valeur": "...", "type": "...", "call_id": "...", "body": "..." }]
    // Structure 2: HTTP response objects [{ "body": {...}, "headers": {...}, "statusCode": 200 }]
    let dataItem = payload[0]
    let rawId = null
    let eventBody = null
    let callId = null
    let callType = null

    // Check if this is an HTTP response object (has statusCode, headers, body with nested response)
    if (dataItem.statusCode && dataItem.headers && dataItem.body) {
      // This is an HTTP response - the actual data might be in the body or we need to look elsewhere
      // Try to find the original request data in the response body or in previous items
      console.log('Received HTTP response object, looking for original request data...')
      
      // The original data might be in a different format or we need to extract from context
      // For now, log and try to extract what we can
      if (dataItem.body && typeof dataItem.body === 'object') {
        // Check if body contains the original request
        if (dataItem.body.valeur) {
          rawId = dataItem.body.valeur
          eventBody = dataItem.body.body
          callId = dataItem.body.call_id
          callType = dataItem.body.type
        }
      }
      
      // If we still don't have the data, it means n8n sent the wrong structure
      // We'll need to handle this case or return an error
      if (!rawId) {
        console.error('HTTP response structure detected but original request data not found')
        console.error('Payload structure:', JSON.stringify(payload, null, 2))
        throw new Error("Format de payload invalide : Les données de la requête originale (valeur, type, call_id) sont manquantes dans la réponse HTTP.")
      }
    } else {
      // Normal structure: direct transfer request data
      dataItem = payload[0]
      rawId = dataItem.valeur
      eventBody = dataItem.body
      
      // Try multiple possible field names for call_id
      callId = dataItem.call_id || 
               dataItem.callId || 
               dataItem.callID || 
               dataItem['call_id'] ||
               dataItem.vapi_call_id ||
               dataItem.vapiCallId ||
               null
      
      // Extract call type from the original n8n payload
      callType = dataItem.type || 
                  dataItem.call_type || 
                  dataItem.callType || 
                  null
    }
    
    // 3. Extraction de l'ID cible ('valeur' = customer ID)
    if (!rawId) {
      throw new Error("Champ 'valeur' (ID client) manquant dans le payload.")
    }

    // Conversion en entier pour matcher le type 'bigint' de PostgreSQL
    const targetCustomerId = parseInt(rawId, 10)

    if (isNaN(targetCustomerId)) {
      throw new Error(`L'ID fourni (${rawId}) n'est pas un nombre valide pour l'ID customer.`)
    }
    
    // Debug: log the received data in detail
    console.log('=== EDGE FUNCTION DEBUG ===')
    console.log('Full payload received:', JSON.stringify(payload, null, 2))
    console.log('First item keys:', Object.keys(payload[0]))
    console.log('Extracted values:', {
      rawId,
      targetCustomerId,
      callId,
      callType,
      eventBodyType: typeof eventBody,
      hasEventBody: !!eventBody
    })
    
    // Warn if we're receiving HTTP response objects instead of original request data
    if (payload[0].statusCode || payload[0].headers) {
      console.warn('⚠️ WARNING: Received HTTP response object instead of original transfer request data!')
      console.warn('n8n should send the original transfer request structure: [{ "valeur": "...", "type": "...", "call_id": "...", "body": "..." }]')
      console.warn('Current payload structure appears to be HTTP response objects.')
    }

    // 5. Insertion dans la table de liaison 'user_events'
    // Store the full original payload structure to preserve type and other fields
    // This allows the dashboard to extract call_type when sending back to n8n
    const fullPayload = {
      body: eventBody,
      type: callType,
      call_id: callId,
      // Include any other fields from the original payload
      ...(dataItem.valeur && { valeur: dataItem.valeur }),
    }
    
    const insertData = {
          customer_id: targetCustomerId, // Lien vers public.customers(id)
          event_type: 'n8n_tool_call',
          payload: fullPayload, // Store full structure including type
          created_at: new Date().toISOString(),
          call_id: callId || null, // Always include call_id, even if null
          call_type: callType || null, // Store call_type separately for easy querying
        }
    
    console.log('Final insert data:', JSON.stringify(insertData, null, 2))
    
    const { data, error } = await supabase
      .from('user_events') 
      .insert([insertData])

    if (error) {
      console.error("Erreur Supabase:", error)
      throw new Error(`Erreur lors de l'insertion: ${error.message}`)
    }

    // 6. Réponse Succès
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Payload enregistré pour le client ID ${targetCustomerId}` 
      }),
      { headers: { "Content-Type": "application/json" } },
    )

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }
})