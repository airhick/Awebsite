# Configuration n8n pour inclure le call_id

## Problème
Les `call_id` sont actuellement `NULL` dans la table `user_events` car n8n n'envoie pas encore ce champ.

## Solution

### 1. Modifier le JSON body dans n8n

Dans votre workflow n8n, modifiez le nœud qui envoie les données à l'edge function Supabase.

**Format actuel :**
```json
[
  {
    "valeur": {{ $json.id_found }},
    "body": {{ JSON.stringify($json.choices[0].message.content) }}
  }
]
```

**Format à utiliser (avec call_id) :**
```json
[
  {
    "valeur": {{ $json.id_found }},
    "body": {{ JSON.stringify($json.choices[0].message.content) }},
    "call_id": "{{ $json.call_id }}"
  }
]
```

### 2. Identifier où se trouve le call_id dans votre workflow

Le `call_id` peut venir de différentes sources selon votre workflow n8n :

#### Option A : Depuis un webhook VAPI
Si vous recevez un webhook de VAPI, le `call_id` est généralement dans :
- `{{ $json.call.id }}`
- `{{ $json.id }}`
- `{{ $json.call_id }}`

#### Option B : Depuis une variable précédente
Si vous avez stocké le call_id dans une variable :
- `{{ $json.callId }}`
- `{{ $json.vapi_call_id }}`

#### Option C : Depuis un nœud précédent
Si le call_id vient d'un nœud précédent dans le workflow :
- `{{ $node["Nom du nœud"].json["call_id"] }}`

### 3. Exemple complet

Si votre workflow reçoit un webhook VAPI avec cette structure :
```json
{
  "call": {
    "id": "019af4e9-a234-788a-86cf-88806793730b",
    "status": "ended"
  },
  "id_found": 3,
  "choices": [{
    "message": {
      "content": "- **Caller's goal**: Locate a pharmacy..."
    }
  }]
}
```

Alors votre JSON body devrait être :
```json
[
  {
    "valeur": {{ $json.id_found }},
    "body": {{ JSON.stringify($json.choices[0].message.content) }},
    "call_id": "{{ $json.call.id }}"
  }
]
```

### 4. Vérification

Après avoir modifié le JSON body dans n8n :
1. Testez votre workflow n8n
2. Vérifiez les logs de l'edge function (dans Supabase Dashboard > Edge Functions > Logs)
3. Vérifiez que les nouveaux événements ont un `call_id` dans la table `user_events`

### 5. Redéployer l'edge function

Si vous avez modifié l'edge function, n'oubliez pas de la redéployer :
```bash
supabase functions deploy n8n-webhook
```

Ou via le dashboard Supabase : Edge Functions > Deploy

## Debug

Si les `call_id` sont toujours vides après ces modifications :

1. **Vérifiez les logs de l'edge function** pour voir ce qui est reçu :
   - Allez dans Supabase Dashboard > Edge Functions > Votre fonction > Logs
   - Cherchez les messages "Received payload:" et "Extracted call_id:"

2. **Vérifiez le format JSON dans n8n** :
   - Assurez-vous que le champ `call_id` est bien présent
   - Vérifiez que la syntaxe JSON est correcte (guillemets, etc.)

3. **Testez avec un call_id statique** pour vérifier que l'edge function fonctionne :
   ```json
   [
     {
       "valeur": 3,
       "body": "Test message",
       "call_id": "test-call-id-123"
     }
   ]
   ```

