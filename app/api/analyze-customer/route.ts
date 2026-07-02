import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { complaint } = await req.json();
    
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an AI Churn Analyst. Analyze the customer's complaint. You must return ONLY a valid JSON object with two keys: 'risk_score' (an integer between 0 and 100, where 100 means they will definitely cancel) and 'reason' (a very short summary, max 5 words, of why they want to cancel). Example format: {\"risk_score\": 85, \"reason\": \"Too expensive and buggy\"}"
        },
        {
          role: "user",
          content: complaint
        }
      ],
      model: "openai/gpt-oss-120b",
      response_format: { type: "json_object" } // Memaksa AI untuk membalas dengan format JSON yang rapi
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    const data = JSON.parse(content);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("ERROR DETAIL:", error?.message || error);
    return NextResponse.json({ error: "Failed to analyze" }, { status: 500 });
  }
}