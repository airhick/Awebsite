import requests
import os
from datetime import datetime

# --- CONFIGURATION ---
API_KEY = "9d09c2ec-4223-41af-a1c9-8bb097b8e5ef"
BASE_URL = "https://api.vapi.ai"
DOWNLOAD_DIR = "vapi_filtered_recordings"

# --- FILTERS ---
# Leave these as None to ignore, or put "string_id" to filter
TARGET_ASSISTANT_ID = None  # e.g., "555b76-..."
TARGET_SQUAD_ID = None      # e.g., "squad-123-..."

# Date Limit (Optional)
START_DATE = "2024-01-01" 

def get_headers():
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

def fetch_filtered_recordings():
    if not os.path.exists(DOWNLOAD_DIR):
        os.makedirs(DOWNLOAD_DIR)

    print(f"--- Starting Download (Saving to /{DOWNLOAD_DIR}) ---")
    
    has_more = True
    created_at_lt = None
    total_found = 0

    while has_more:
        # Build query params
        params = {
            "limit": 1000,
            "createdAtGt": f"{START_DATE}T00:00:00Z" if START_DATE else None
        }
        
        # OPTIMIZATION: If looking for a specific assistant, ask API to filter
        if TARGET_ASSISTANT_ID:
            params["assistantId"] = TARGET_ASSISTANT_ID
            
        if created_at_lt:
            params["createdAtLt"] = created_at_lt

        try:
            response = requests.get(f"{BASE_URL}/call", headers=get_headers(), params=params)
            response.raise_for_status()
            calls = response.json()
        except Exception as e:
            print(f"Error fetching list: {e}")
            break

        if not calls:
            print("No more calls found.")
            break

        print(f"Checking batch of {len(calls)} calls...")

        for call in calls:
            # Update cursor (MUST happen before 'continue' skips)
            created_at_lt = call.get('createdAt')

            # --- CLIENT-SIDE FILTERS ---
            
            # 1. Squad Filter (API doesn't do this, so we do it here)
            if TARGET_SQUAD_ID:
                call_squad_id = call.get('squadId')
                # Sometimes squadId is nested in a 'squad' object
                if not call_squad_id and call.get('squad'):
                    call_squad_id = call.get('squad').get('id')
                
                if call_squad_id != TARGET_SQUAD_ID:
                    continue # Skip this call, it's not the right squad

            # 2. Process Valid Call
            process_call(call)
            total_found += 1
        
        if len(calls) < 1000:
            has_more = False

    print(f"--- Completed. Total matching calls downloaded: {total_found} ---")

def process_call(call):
    call_id = call.get('id')
    artifact = call.get('artifact', {})
    
    # Try multiple paths to find the recording
    recording_url = artifact.get('recordingUrl') or artifact.get('recording', {}).get('url')

    if not recording_url:
        return

    ext = "mp3" if "mp3" in recording_url else "wav"
    file_path = os.path.join(DOWNLOAD_DIR, f"{call_id}.{ext}")

    if os.path.exists(file_path):
        # Optional: print skipped message to reduce noise
        # print(f"Skipping {call_id} (Exists)") 
        return

    try:
        r = requests.get(recording_url)
        with open(file_path, 'wb') as f:
            f.write(r.content)
        print(f"Downloaded: {call_id}.{ext}")
    except Exception as e:
        print(f"Failed to download {call_id}: {e}")

if __name__ == "__main__":
    fetch_filtered_recordings()