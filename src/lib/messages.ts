import { MessageData } from "@/components/MessageCard";

// Fetch all real messages directly from Firebase via the API bridge
export async function fetchFirebaseMessages(): Promise<MessageData[]> {
  const res = await fetch("/api/messages", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch from Firebase: HTTP ${res.status}`);
  }

  const json = await res.json();
  if (!json.success || !Array.isArray(json.messages)) {
    throw new Error(json.error || "Invalid response structure from Firebase");
  }

  return json.messages as MessageData[];
}

// Submit a new message directly to Firebase Firestore
export async function submitFirebaseMessage(data: Partial<MessageData>): Promise<MessageData> {
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error || `Failed to submit to Firebase: HTTP ${res.status}`);
  }

  const json = await res.json();
  if (!json.success || !json.message) {
    throw new Error(json.error || "Failed to save message to Firebase");
  }

  return json.message as MessageData;
}
