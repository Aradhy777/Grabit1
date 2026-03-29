import { NextResponse } from "next/server";
import genAI from "@/lib/gemini";

export async function POST(req) {
  try {
    const { transcript } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are a university teaching assistant.

Convert the following lecture transcript into structured study notes.

Return in this format:

Topic:
Summary:
Key Concepts:
Important Definitions:
Bullet Notes:

Transcript:
${transcript}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return NextResponse.json({
      notes: response.text(),
    });

  } catch (error) {
    console.error("Gemini Notes Error:", error);
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return NextResponse.json(
        { error: "Rate limit reached. Please wait a moment." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Notes generation failed: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
