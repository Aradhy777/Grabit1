import { NextResponse } from "next/server";
import genAI from "@/lib/gemini";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio");
    const previousTranscript = formData.get("context") || ""; // Optional context from previous chunks

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const base64Audio = Buffer.from(bytes).toString("base64");

    const mimeType = file.type || "audio/webm";

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
      You are an expert academic processing engine. 
      The provided audio is a live classroom lecture that may contain a mix of English, Hindi, and Hinglish.
      
      Follow this internal pipeline to process the audio:
      1. 🧠 Speech-to-Text: Convert the audio stream into raw text (Hindi, English, or Hinglish).
      2. 🌐 Language Normalization: If the speaker uses Hindi or Hinglish, translate it accurately into high-quality English.
      3. 🧹 Content Filter: Remove filler words (um, ah, like, you know), repetitions, and non-academic noise.
      4. 📄 Structured Output: Format the final text as clean, formal Academic English.
      
      CONSTRAINTS:
      - Output ONLY the final structured output.
      - Maintain technical and academic terminology correctly.
      - Context of previous transcription (for continuity): "${previousTranscript}"
      
      Start from where the context left off.
    `;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType,
          data: base64Audio,
        },
      },
      prompt
    ]);

    const response = await result.response;
    const text = response.text().trim();

    return NextResponse.json({ transcript: text });

  } catch (error) {
    console.error("Live Transcription Error:", error);
    
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return NextResponse.json(
        { error: "Rate limit reached. System is cooling down." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}
