import { submitWPComment } from "../../../../lib/wordpress";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { postId, authorName, authorEmail, content, parent } = await req.json();

    if (!postId || !authorName || !authorEmail || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const comment = await submitWPComment(postId, authorName, authorEmail, content, parent ?? 0);
    return NextResponse.json(comment, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit comment";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
