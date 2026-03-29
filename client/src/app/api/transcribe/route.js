import { NextResponse } from "next/server";
import genAI from "@/lib/gemini";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio");

    const bytes = await file.arrayBuffer();
    const base64Audio = Buffer.from(bytes).toString("base64");

    // Robust MIME type handling
    let mimeType = file.type;
    if (!mimeType || mimeType === "application/octet-stream") {
      const extension = file.name.split('.').pop()?.toLowerCase();
      const mimeMap = {
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'm4a': 'audio/mp4',
        'aac': 'audio/aac',
        'ogg': 'audio/ogg'
      };
      mimeType = mimeMap[extension] || "audio/mpeg"; // Fallback to mpeg
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Audio,
        },
      },
      "Transcribe this lecture audio into text. Only process if it is a clear audio recording of a lecture."
    ]);

    const response = await result.response;
    const transcript = response.text();

    return NextResponse.json({ transcript });

  } catch (error) {
    console.error("Gemini Error:", error);
    
    // Handle Rate Limits (429)
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return NextResponse.json(
        { error: "Rate limit reached. Please wait 60 seconds and try again." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Transcription failed: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
