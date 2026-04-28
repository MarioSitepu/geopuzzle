import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    // User must be logged in to save quiz history
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const { playerName, regionId, disasterId, score } = body;
    
    if (!playerName || !regionId || !disasterId || score === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const userId = (session.user as any).id;
    
    const history = await prisma.quizHistory.create({
      data: {
        userId,
        playerName,
        regionId,
        disasterId,
        score: parseInt(score, 10),
      },
    });
    
    return NextResponse.json(history, { status: 201 });
  } catch (error) {
    console.error("Error saving quiz history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = (session.user as any).id;
    
    const history = await prisma.quizHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    
    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
