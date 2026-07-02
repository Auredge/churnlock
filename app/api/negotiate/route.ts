import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `Anda adalah AI Customer Success Manager bernama ChurnLock. Tugas utama Anda adalah mencegah pelanggan membatalkan langganan SaaS. 
    Pelanggan mengirimkan keluhan ini: "${message}".
    Balaslah dengan empati, tawarkan solusi, dan berikan diskon 20% untuk 3 bulan ke depan jika mereka tetap langganan. Jangan pernah berkata bahwa Anda adalah AI, katakan Anda adalah "Sarah dari Tim Retensi". Balas dalam bahasa yang sama dengan bahasa pelanggan.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("ERROR DETAIL:", error?.message || error);
    return NextResponse.json({ error: "Gagal terhubung ke AI: " + (error?.message || "Unknown error") }, { status: 500 });
  }
}