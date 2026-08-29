import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// In-memory server-side questions store with usage ranking
let POPULAR_QUESTIONS = [
  {
    id: 1,
    text: "Which crop is best for the current season?",
    category: "Crop Planning",
    count: 284,
  },
  {
    id: 2,
    text: "How to increase crop yield naturally?",
    category: "Yield & Health",
    count: 215,
  },
  {
    id: 3,
    text: "What are the symptoms of nitrogen deficiency?",
    category: "Soil & Nutrients",
    count: 198,
  },
  {
    id: 4,
    text: "How to control aphids in vegetables?",
    category: "Pest & Disease",
    count: 172,
  },
  {
    id: 5,
    text: "What is the PM-KISAN eligibility criteria?",
    category: "Government Schemes",
    count: 146,
  },
  {
    id: 6,
    text: "How much fertilizer is needed for wheat?",
    category: "Soil & Nutrients",
    count: 139,
  },
];

export async function GET() {
  const sorted = [...POPULAR_QUESTIONS].sort((a, b) => b.count - a.count);
  return NextResponse.json({
    success: true,
    data: sorted.slice(0, 4),
  });
}

export async function POST(req: Request) {
  try {
    const { questionId } = await req.json();
    const q = POPULAR_QUESTIONS.find((item) => item.id === questionId);
    if (q) {
      q.count += 1;
      return NextResponse.json({ success: true, data: q });
    }
    return NextResponse.json(
      { success: false, error: "Question not found" },
      { status: 404 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 },
    );
  }
}
