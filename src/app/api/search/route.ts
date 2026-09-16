import { NextRequest, NextResponse } from "next/server";
import { searchPosts } from "../../../../lib/wordpress";

// Header search, backed by WordPress's own index rather than by whatever posts
// the page happened to be holding. See the note on searchPosts in
// lib/wordpress.ts for what this replaced.

// Two characters is the shortest query worth sending to the origin; anything
// shorter matches so much that the result is noise, and it would put a request
// on WordPress for every keystroke of a word.
const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 100;
const RESULTS = 10;

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") ?? "").trim();

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ posts: [], query }, { status: 200 });
  }
  if (query.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: "Query too long", posts: [] },
      { status: 400 },
    );
  }

  const posts = await searchPosts(query, RESULTS);

  return NextResponse.json(
    { posts, query },
    {
      headers: {
        // Same shape as the other list endpoints: repeat searches for a popular
        // term are served from the edge instead of hitting shared hosting,
        // which matters here because search is the one surface where readers
        // generate arbitrary origin traffic.
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    },
  );
}
