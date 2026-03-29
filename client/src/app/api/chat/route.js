import { NextResponse } from "next/server";
import genAI from "@/lib/gemini";

export async function POST(req) {
  try {
    const { transcript, question } = await req.json();

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const prompt = `
You are a teaching assistant helping a student understand a lecture.

Use the lecture transcript below to answer the student's question.

Lecture Transcript:
${transcript}

Student Question:
${question}

Answer clearly and simply.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return NextResponse.json({
      answer: response.text(),
    });

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    if (error.message?.includes("429") || error.message?.includes("quota")) {
      return NextResponse.json(
        { error: "Rate limit reached. I need a short break!" },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Chat failed: " + (error.message || "Unknown error") },
      { status: 500 }
    );
  }
}
