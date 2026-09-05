import { NextResponse } from "next/server";
import { normalizeFirestoreMessage } from "@/lib/messageAdapter";
import { SAMPLE_ARCHIVE_RECORDS } from "@/data/sampleArchiveRecords";

const API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBHz2WmR09Q6YA7rzLgnyhPJuXOEolhBUE";
const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "unsaid-project";
const APP_ID = "unsaid-modern-mvp";
const AUTHORIZED_REFERER = "https://somethingsarebetterleftunsaid.vercel.app";

// Helper to obtain a valid Firebase anonymous ID token
async function getAuthToken(): Promise<string | null> {
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Referer: AUTHORIZED_REFERER,
        },
        body: JSON.stringify({ returnSecureToken: true }),
      }
    );
    const data = await res.json();
    return data.idToken || null;
  } catch (err) {
    console.error("Error obtaining Firebase auth token:", err);
    return null;
  }
}

export async function GET() {
  try {
    const idToken = await getAuthToken();
    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "Failed to authenticate with Firebase" },
        { status: 401 }
      );
    }

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/artifacts/${APP_ID}/public/data/messages?pageSize=100`;

    const res = await fetch(firestoreUrl, {
      headers: {
        Authorization: `Bearer ${idToken}`,
        Referer: AUTHORIZED_REFERER,
      },
      next: { revalidate: 10 }, // Cache for 10 seconds for ultra-fast response
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Firestore REST API error:", errText);
      return NextResponse.json(
        { success: false, error: "Firestore query returned error status" },
        { status: res.status }
      );
    }

    const data = await res.json();
    const rawDocs = data.documents || [];

    // Normalize all real Firebase documents
    const messages = rawDocs.map((doc: { name?: string; fields?: Record<string, unknown> }, index: number) =>
      normalizeFirestoreMessage(
        {
          id: doc.name ? doc.name.split("/").pop() : `doc-${index}`,
          fields: doc.fields,
        },
        index
      )
    );

    // Sort by creation date descending (newest first)
    messages.sort(
      (a: { createdAt?: { seconds: number } }, b: { createdAt?: { seconds: number } }) =>
        (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    );

    if (messages.length === 0) {
      return NextResponse.json({
        success: true,
        count: SAMPLE_ARCHIVE_RECORDS.length,
        messages: SAMPLE_ARCHIVE_RECORDS,
      });
    }

    return NextResponse.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.warn("Notice: Live Firebase fetch unavailable, serving local archival fallback:", message);
    return NextResponse.json({
      success: true,
      count: SAMPLE_ARCHIVE_RECORDS.length,
      messages: SAMPLE_ARCHIVE_RECORDS,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, msg, emotion, palette, bg, font, size, weight, leading, align, border, padding, radius, width } = body;

    if (!msg || typeof msg !== "string" || !msg.trim()) {
      return NextResponse.json(
        { success: false, error: "Message content cannot be empty" },
        { status: 400 }
      );
    }

    const idToken = await getAuthToken();
    if (!idToken) {
      return NextResponse.json(
        { success: false, error: "Failed to authenticate with Firebase" },
        { status: 401 }
      );
    }

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/artifacts/${APP_ID}/public/data/messages`;

    const nowIso = new Date().toISOString();

    const firestoreBody = {
      fields: {
        msg: { stringValue: msg.trim() },
        to: { stringValue: (to || "Someone").trim() },
        emotion: { stringValue: (emotion || "LOVE").toUpperCase() },
        palette: { stringValue: palette || "dusty-rose" },
        bg: { stringValue: bg || "#EFEAE0" },
        font: { stringValue: font || "font-serif" },
        size: { stringValue: size || "size-medium" },
        weight: { stringValue: weight || "weight-normal" },
        leading: { stringValue: leading || "leading-normal" },
        align: { stringValue: align || "align-center" },
        border: { stringValue: border || "border-thin" },
        padding: { stringValue: padding || "pad-balanced" },
        radius: { stringValue: radius || "rad-round" },
        width: { stringValue: width || "width-standard" },
        toOpacity: { stringValue: "opacity-100" },
        icon: { stringValue: "show" },
        footer: { stringValue: "show" },
        createdAt: { timestampValue: nowIso },
      },
    };

    const res = await fetch(firestoreUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
        Referer: AUTHORIZED_REFERER,
      },
      body: JSON.stringify(firestoreBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Firestore insert error:", errText);
      return NextResponse.json(
        { success: false, error: "Failed to write to Firestore" },
        { status: res.status }
      );
    }

    const createdDoc = await res.json();
    const normalized = normalizeFirestoreMessage({
      id: createdDoc.name ? createdDoc.name.split("/").pop() : "doc-new",
      fields: createdDoc.fields,
    });

    return NextResponse.json({
      success: true,
      message: normalized,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Error creating message in Firebase:", message);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
