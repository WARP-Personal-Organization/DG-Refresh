import Link from "next/link";
import { getFacebookPosts } from "../../lib/facebook";

function timeAgo(iso: string): string {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default async function FacebookFeed() {
  const posts = await getFacebookPosts(5);
  const hasCredentials = !!(process.env.FB_APP_ID && process.env.FB_APP_SECRET);

  return (
    <div className="rounded-xl overflow-hidden border border-[#fcee16]/20 bg-[#111] shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg bg-[#1877F2] flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="white">
            <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-black uppercase tracking-widest text-[#fbd203] font-roboto leading-none mb-0.5">
            Follow Us
          </p>
          <a
            href="https://www.facebook.com/DailyGuardianPH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-gray-400 hover:text-[#1877F2] transition-colors font-open-sans"
          >
            facebook.com/DailyGuardianPH ↗
          </a>
        </div>
        <a
          href="https://www.facebook.com/DailyGuardianPH"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-[10px] font-bold text-white bg-[#1877F2] hover:bg-[#1877F2]/80 px-3 py-1.5 rounded-full transition-colors font-roboto"
        >
          + Follow
        </a>
      </div>

      {/* Posts */}
      {posts.length > 0 ? (
        <div className="divide-y divide-white/5">
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.permalink_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
            >
              {/* Thumbnail */}
              {post.full_picture && (
                <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden bg-gray-800">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.full_picture}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-300 leading-snug line-clamp-3 font-open-sans group-hover:text-white transition-colors">
                  {post.message || post.story || "View post on Facebook"}
                </p>
                <p className="text-[10px] text-gray-600 mt-1.5 font-open-sans">
                  {timeAgo(post.created_time)}
                </p>
              </div>
            </a>
          ))}
        </div>
      ) : (
        /* No credentials fallback */
        <div className="px-4 py-6 flex flex-col items-center gap-3 text-center">
          {!hasCredentials && (
            <p className="text-xs text-gray-500 font-open-sans leading-relaxed">
              Add <code className="text-[#fbd203]">FB_APP_ID</code> and{" "}
              <code className="text-[#fbd203]">FB_APP_SECRET</code> to your{" "}
              <code className="text-gray-400">.env</code> file to show live
              Facebook posts.
            </p>
          )}
          <a
            href="https://www.facebook.com/DailyGuardianPH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#1877F2] hover:underline font-roboto"
          >
            Visit our Facebook page →
          </a>
        </div>
      )}

      {/* Footer */}
      {posts.length > 0 && (
        <div className="px-4 py-2.5 border-t border-white/5 text-center">
          <a
            href="https://www.facebook.com/DailyGuardianPH"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-gray-500 hover:text-[#1877F2] transition-colors font-open-sans"
          >
            See all posts on Facebook →
          </a>
        </div>
      )}
    </div>
  );
}
