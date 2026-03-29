import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Mock database response for user's library
    const libraryLectures = [
      { 
        id: "l1", 
        title: "Introduction to Machine Learning", 
        date: "2024-03-10", 
        duration: "45:00",
        summary: "Basics of supervised vs unsupervised learning."
      },
      { 
        id: "l2", 
        title: "Neural Networks Backpropagation", 
        date: "2024-03-12", 
        duration: "52:20",
        summary: "Understanding the chain rule in backprop."
      },
      { 
        id: "l3", 
        title: "Convolutional Networks in CV", 
        date: "2024-03-15", 
        duration: "1:10:00",
        summary: "Filters, padding, and max pooling operations."
      },
    ];

    return NextResponse.json({ lectures: libraryLectures });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch library" },
      { status: 500 }
    );
  }
}
