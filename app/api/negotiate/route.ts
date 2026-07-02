import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    // Kita ganti nama variabelnya agar lebih luas maknanya
    const { message, agentName, companyName, customSolution } = await req.json();
    
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

    const prompt = `You are an AI Customer Success Manager named ${agentName || 'Sarah'} working for ${companyName || 'the company'}. Your main task is to prevent customers from canceling their SaaS subscriptions. Respond with empathy, but keep it SHORT, CONCISE, and DIRECT TO THE POINT (maximum 2 paragraphs). Do not make long lists of questions. 

    To save the customer, you must offer the following solution: "${customSolution || 'a 20% discount for the next 3 months'}". 
    Be persuasive but natural in offering this solution. Never say you are an AI; introduce yourself as '${agentName || 'Sarah'} from the Retention Team at ${companyName || 'the company'}'. ALWAYS RESPOND IN THE SAME LANGUAGE THE CUSTOMER USES.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: prompt
        },
        {
          role: "user",
          content: message
        }
      ],
      model: "openai/gpt-oss-120b",
    });

    const text = chatCompletion.choices[0]?.message?.content || "Sorry, an error occurred.";

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("ERROR DETAIL:", error?.message || error);
    return NextResponse.json({ error: "Failed to connect to AI: " + (error?.message || "Unknown error") }, { status: 500 });
  }
}