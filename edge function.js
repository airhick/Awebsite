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

    const dataItem = payload[0]
    
    // 3. Extraction de l'ID cible ('valeur' = '1')
    // ATTENTION : Ta table customers utilise un 'bigint', donc on s'assure que c'est propre
    const rawId = dataItem.valeur
    
    if (!rawId) {
      throw new Error("Champ 'valeur' (ID client) manquant.")
    }

    // Conversion en entier pour matcher le type 'bigint' de PostgreSQL
    const targetCustomerId = parseInt(rawId, 10)

    if (isNaN(targetCustomerId)) {
      throw new Error(`L'ID fourni (${rawId}) n'est pas un nombre valide pour l'ID customer.`)
    }

    // 4. Préparation de la donnée
    const eventBody = dataItem.body

    // Try multiple possible field names for call_id
    const callId = dataItem.call_id || 
                   dataItem.callId || 
                   dataItem.callID || 
                   dataItem['call_id'] ||
                   dataItem.vapi_call_id ||
                   dataItem.vapiCallId ||
                   null
    
    // Debug: log the received data in detail
    console.log('=== EDGE FUNCTION DEBUG ===')
    console.log('Full payload received:', JSON.stringify(payload, null, 2))
    console.log('DataItem keys:', Object.keys(dataItem))
    console.log('DataItem values:', JSON.stringify(dataItem, null, 2))
    console.log('Looking for call_id in:', {
      'call_id': dataItem.call_id,
      'callId': dataItem.callId,
      'callID': dataItem.callID,
      'vapi_call_id': dataItem.vapi_call_id,
      'vapiCallId': dataItem.vapiCallId
    })
    console.log('Extracted call_id:', callId)
    console.log('Extracted customer_id:', targetCustomerId)
    console.log('Event body type:', typeof eventBody)

    // 5. Insertion dans la table de liaison 'user_events'
    // On mappe 'valeur' -> 'customer_id' et 'call_id' -> 'call_id'
    const insertData = {
          customer_id: targetCustomerId, // Lien vers public.customers(id)
          event_type: 'n8n_tool_call',
          payload: eventBody,
          created_at: new Date().toISOString()
        }
    
    // Always include call_id, even if null (so we can see it in the database)
    insertData.call_id = callId || null
    
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