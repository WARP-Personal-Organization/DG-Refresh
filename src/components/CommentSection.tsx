"use client";

import type { WPComment } from "../../lib/wordpress";
import { Flag, MessageCircle, Reply, Send, ThumbsDown, ThumbsUp, User } from "lucide-react";
import { useEffect, useState } from "react";

interface CommentNode extends WPComment {
  replies: CommentNode[];
}

interface CommentSectionProps {
  postId: number;
  initialComments?: WPComment[];
}

function buildTree(comments: WPComment[]): CommentNode[] {
  const map = new Map<number, CommentNode>();
  const roots: CommentNode[] = [];

  comments.forEach((c) => map.set(c.id, { ...c, replies: [] }));
  map.forEach((node) => {
    if (node.parent === 0) {
      roots.push(node);
    } else {
      map.get(node.parent)?.replies.push(node);
    }
  });

  return roots;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

function formatTimeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

interface ReplyState { name: string; email: string; text: string }
const emptyReply = (): ReplyState => ({ name: "", email: "", text: "" });

const CommentSection = ({ postId, initialComments = [] }: CommentSectionProps) => {
  const [tree, setTree] = useState<CommentNode[]>(() => buildTree(initialComments));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyState, setReplyState] = useState<ReplyState>(emptyReply());
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [disliked, setDisliked] = useState<Set<number>>(new Set());

  useEffect(() => {
    const savedName = localStorage.getItem("commenter_name");
    const savedEmail = localStorage.getItem("commenter_email");
    if (savedName) setName(savedName);
    if (savedEmail) setEmail(savedEmail);
    if (savedName || savedEmail) setRememberMe(true);
  }, []);

  const validate = (n: string, e: string, t: string) => {
    const errs: Record<string, string> = {};
    if (!n.trim()) errs.name = "Name is required";
    if (!e.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) errs.email = "Enter a valid email";
    if (!t.trim()) errs.comment = "Comment is required";
    return errs;
  };

  const postComment = async (content: string, authorName: string, authorEmail: string, parent = 0) => {
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, authorName, authorEmail, content, parent }),
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json() as Promise<WPComment>;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(name, email, text);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    if (rememberMe) {
      localStorage.setItem("commenter_name", name);
      localStorage.setItem("commenter_email", email);
    } else {
      localStorage.removeItem("commenter_name");
      localStorage.removeItem("commenter_email");
    }

    setSubmitting(true);
    try {
      const newComment = await postComment(text, name, email);
      setTree((prev) => [{ ...newComment, replies: [] }, ...prev]);
      setText("");
      if (!rememberMe) { setName(""); setEmail(""); }
      setErrors({});
    } catch {
      setErrors({ submit: "Failed to post comment. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReplySubmit = async (parentId: number) => {
    const errs = validate(replyState.name, replyState.email, replyState.text);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      const newReply = await postComment(replyState.text, replyState.name, replyState.email, parentId);
      const addReply = (nodes: CommentNode[]): CommentNode[] =>
        nodes.map((n) =>
          n.id === parentId
            ? { ...n, replies: [...n.replies, { ...newReply, replies: [] }] }
            : { ...n, replies: addReply(n.replies) }
        );
      setTree((prev) => addReply(prev));
      setReplyingTo(null);
      setReplyState(emptyReply());
    } catch {
      // silent — keep form open
    } finally {
      setSubmitting(false);
    }
  };

  const totalCount = (nodes: CommentNode[]): number =>
    nodes.reduce((acc, n) => acc + 1 + totalCount(n.replies), 0);

  const CommentItem = ({ node, depth = 0 }: { node: CommentNode; depth?: number }) => (
    <div className={`${depth > 0 ? "ml-8 border-l-2 border-gray-700 pl-6" : ""} mb-8`}>
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-[#fcee16] rounded-full flex items-center justify-center flex-shrink-0">
          <User size={18} className="text-[#1b1a1b]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-white font-open-sans">{node.author_name}</span>
            <span className="text-gray-400 text-sm font-open-sans">{formatTimeAgo(node.date)}</span>
          </div>

          <p className="text-gray-200 mb-4 leading-relaxed font-open-sans">
            {stripHtml(node.content.rendered)}
          </p>

          <div className="flex items-center gap-6 text-sm mb-4">
            <button
              onClick={() => setLiked((s) => { const n = new Set(s); n.has(node.id) ? n.delete(node.id) : n.add(node.id); return n; })}
              className={`flex items-center gap-2 transition-colors duration-200 ${liked.has(node.id) ? "text-[#fcee16]" : "text-gray-400 hover:text-[#fcee16]"}`}
            >
              <ThumbsUp size={16} />
            </button>

            <button
              onClick={() => setDisliked((s) => { const n = new Set(s); n.has(node.id) ? n.delete(node.id) : n.add(node.id); return n; })}
              className={`flex items-center gap-2 transition-colors duration-200 ${disliked.has(node.id) ? "text-red-400" : "text-gray-400 hover:text-red-400"}`}
            >
              <ThumbsDown size={16} />
            </button>

            {depth === 0 && (
              <button
                onClick={() => setReplyingTo(replyingTo === node.id ? null : node.id)}
                className="flex items-center gap-2 text-gray-400 hover:text-[#fcee16] transition-colors duration-200"
              >
                <Reply size={16} />
                <span className="font-open-sans">Reply</span>
              </button>
            )}

            <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors duration-200">
              <Flag size={16} />
              <span className="font-open-sans">Report</span>
            </button>
          </div>

          {replyingTo === node.id && (
            <div className="mt-6 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 className="text-lg font-bold text-white mb-4 font-roboto">Reply to {node.author_name}</h4>
              <form onSubmit={(e) => { e.preventDefault(); handleReplySubmit(node.id); }} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={replyState.name}
                    onChange={(e) => setReplyState((s) => ({ ...s, name: e.target.value }))}
                    placeholder="Name: *"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:border-[#fcee16] focus:outline-none font-open-sans"
                    required
                  />
                  <input
                    type="email"
                    value={replyState.email}
                    onChange={(e) => setReplyState((s) => ({ ...s, email: e.target.value }))}
                    placeholder="Email: *"
                    className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:border-[#fcee16] focus:outline-none font-open-sans"
                    required
                  />
                </div>
                <textarea
                  value={replyState.text}
                  onChange={(e) => setReplyState((s) => ({ ...s, text: e.target.value }))}
                  placeholder="Write your reply..."
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:border-[#fcee16] focus:outline-none resize-none font-open-sans"
                  rows={4}
                  required
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => { setReplyingTo(null); setReplyState(emptyReply()); }}
                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded font-medium hover:bg-gray-600 transition-colors duration-200 font-open-sans"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-[#fcee16] text-[#1b1a1b] rounded font-medium hover:bg-[#fcee16]/80 transition-colors duration-200 disabled:opacity-50 font-open-sans flex items-center gap-2"
                  >
                    <Send size={16} />
                    {submitting ? "Posting..." : "Post Reply"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {node.replies.length > 0 && (
            <div className="mt-6">
              {node.replies.map((reply) => (
                <CommentItem key={reply.id} node={reply} depth={depth + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-16 pt-8 border-t border-default">
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle size={24} className="text-[#fcee16]" />
        <h3 className="text-2xl font-bold text-white font-roboto">
          Comments ({totalCount(tree)})
        </h3>
      </div>

      <div className="mb-12">
        <h3 className="text-xl font-bold text-white mb-6 font-roboto uppercase tracking-wider">
          LEAVE A REPLY
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setErrors((s) => ({ ...s, comment: "" })); }}
              placeholder="Comment:"
              className={`w-full p-4 bg-gray-800 border rounded text-gray-200 placeholder-gray-400 focus:outline-none resize-none font-open-sans ${errors.comment ? "border-red-500" : "border-gray-600 focus:border-[#fcee16]"}`}
              rows={6}
              required
            />
            {errors.comment && <p className="text-red-400 text-sm mt-2 font-open-sans">{errors.comment}</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors((s) => ({ ...s, name: "" })); }}
                placeholder="Name: *"
                className={`w-full p-4 bg-gray-800 border rounded text-gray-200 placeholder-gray-400 focus:outline-none font-open-sans ${errors.name ? "border-red-500" : "border-gray-600 focus:border-[#fcee16]"}`}
                required
              />
              {errors.name && <p className="text-red-400 text-sm mt-2 font-open-sans">{errors.name}</p>}
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((s) => ({ ...s, email: "" })); }}
                placeholder="Email: *"
                className={`w-full p-4 bg-gray-800 border rounded text-gray-200 placeholder-gray-400 focus:outline-none font-open-sans ${errors.email ? "border-red-500" : "border-gray-600 focus:border-[#fcee16]"}`}
                required
              />
              {errors.email && <p className="text-red-400 text-sm mt-2 font-open-sans">{errors.email}</p>}
            </div>
          </div>

          {errors.submit && <p className="text-red-400 text-sm font-open-sans">{errors.submit}</p>}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-[#fcee16] focus:ring-2"
              />
              <label htmlFor="remember-me" className="text-gray-300 font-open-sans">Remember me</label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 border-2 border-[#fcee16] text-[#fcee16] hover:bg-[#fcee16] hover:text-[#1b1a1b] font-medium transition-colors duration-200 disabled:opacity-50 font-open-sans flex items-center gap-2"
            >
              <Send size={16} />
              {submitting ? "Posting Comment..." : "Post Comment"}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {tree.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-open-sans mb-2">No comments yet</p>
            <p className="text-gray-500 font-open-sans">Be the first to share your thoughts!</p>
          </div>
        ) : (
          tree.map((node) => <CommentItem key={node.id} node={node} />)
        )}
      </div>
    </div>
  );
};

export default CommentSection;
