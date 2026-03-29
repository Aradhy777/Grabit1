import { NextResponse } from "next/server";
import genAI from "@/lib/gemini";

export async function POST(req) {
  try {
    const { transcript } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
Analyze this lecture transcript and extract the most important learning moments.

Return:

Key Concepts
Important Definitions
Exam Relevant Points
Major Explanations

Transcript:
${transcript}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return NextResponse.json({
      highlights: response.text(),
    });

  } catch (error) {
    console.error("Gemini Highlights Error:", error);
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return NextResponse.json(
        { error: "Rate limit reached. Please wait a moment." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Highlight extraction failed: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
