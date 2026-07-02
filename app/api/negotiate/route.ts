import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Anda adalah AI Customer Success Manager bernama ChurnLock. Tugas utama Anda mencegah pelanggan membatalkan langganan SaaS. Balaslah dengan empati yang mendalam, profesional, dan sangat meyakinkan. Tawarkan solusi yang detail dan berikan diskon 20% untuk 3 bulan ke depan. Jangan pernah bilang Anda AI, perkenalkan diri sebagai 'Sarah dari Tim Retensi'. Tulis balasan yang panjang, terstruktur, dan sangat persuasif (minimal 3 paragraf)."        },
        {
          role: "user",
          content: message
        }
      ],
      model: "openai/gpt-oss-120b",
    });

    const text = chatCompletion.choices[0]?.message?.content || "Maaf, terjadi kesalahan.";

    return NextResponse.json({ reply: text });
  } catch (error: any) {
    console.error("ERROR DETAIL:", error?.message || error);
    return NextResponse.json({ error: "Gagal terhubung ke AI: " + (error?.message || "Unknown error") }, { status: 500 });
  }
}