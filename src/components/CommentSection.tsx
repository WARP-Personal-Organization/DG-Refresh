"use client";

import {
  Flag,
  MessageCircle,
  Reply,
  Send,
  ThumbsDown,
  ThumbsUp,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  timestamp: Date;
  likes: number;
  dislikes: number;
  replies?: Comment[];
  isLiked?: boolean;
  isDisliked?: boolean;
}

interface CommentFormData {
  name: string;
  email: string;
  comment: string;
  rememberMe: boolean;
}

interface CommentSectionProps {
  postId: string;
  initialComments?: Comment[];
}

const CommentSection = ({
  postId,
  initialComments = [],
}: CommentSectionProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [formData, setFormData] = useState<CommentFormData>({
    name: "",
    email: "",
    comment: "",
    rememberMe: false,
  });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyFormData, setReplyFormData] = useState<CommentFormData>({
    name: "",
    email: "",
    comment: "",
    rememberMe: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isInitialized, setIsInitialized] = useState(false);

  // Memoize mock comments to prevent recreating on every render
  const mockComments: Comment[] = useMemo(
    () => [
      {
        id: "1",
        name: "Maria Santos",
        email: "maria@example.com",
        content:
          "This is a very insightful article. Thank you for sharing this important information with us. I learned a lot from reading this piece.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        likes: 12,
        dislikes: 1,
        replies: [
          {
            id: "1-1",
            name: "Juan Dela Cruz",
            email: "juan@example.com",
            content:
              "I completely agree with your perspective on this matter. The author did an excellent job explaining the complexities.",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
            likes: 5,
            dislikes: 0,
          },
        ],
      },
      {
        id: "2",
        name: "Robert Chen",
        email: "robert@example.com",
        content:
          "Great reporting! This really helps me understand the current situation better. Keep up the excellent work with such detailed coverage.",
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        likes: 8,
        dislikes: 0,
      },
      {
        id: "3",
        name: "Elena Rodriguez",
        email: "elena@example.com",
        content:
          "I have some concerns about the points raised in this article. Would love to see more sources on this topic for better understanding.",
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        likes: 3,
        dislikes: 2,
      },
    ],
    []
  ); // Empty dependency array since this data is static

  // Load saved user data and initialize comments only once
  useEffect(() => {
    if (isInitialized) return;

    // Load saved user data from localStorage
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("commenter_name");
      const savedEmail = localStorage.getItem("commenter_email");

      if (savedName || savedEmail) {
        setFormData((prev) => ({
          ...prev,
          name: savedName || "",
          email: savedEmail || "",
          rememberMe: true,
        }));
      }
    }

    // Set initial comments
    const commentsToUse =
      initialComments.length > 0 ? initialComments : mockComments;
    setComments(commentsToUse);
    setIsInitialized(true);
  }, []); // Only run once on mount

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const validateForm = (data: CommentFormData): { [key: string]: string } => {
    const newErrors: { [key: string]: string } = {};

    if (!data.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!data.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!data.comment.trim()) {
      newErrors.comment = "Comment is required";
    }

    return newErrors;
  };

  const handleInputChange = (
    field: keyof CommentFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleReplyInputChange = (
    field: keyof CommentFormData,
    value: string | boolean
  ) => {
    setReplyFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Save user data if remember me is checked
    if (typeof window !== "undefined") {
      if (formData.rememberMe) {
        localStorage.setItem("commenter_name", formData.name);
        localStorage.setItem("commenter_email", formData.email);
      } else {
        localStorage.removeItem("commenter_name");
        localStorage.removeItem("commenter_email");
      }
    }

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newComment: Comment = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      content: formData.comment,
      timestamp: new Date(),
      likes: 0,
      dislikes: 0,
    };

    setComments((prev) => [newComment, ...prev]);
    setFormData((prev) => ({
      name: prev.rememberMe ? prev.name : "",
      email: prev.rememberMe ? prev.email : "",
      comment: "",
      rememberMe: prev.rememberMe,
    }));
    setIsSubmitting(false);
    setErrors({});
  };

  const handleSubmitReply = async (parentId: string) => {
    const validationErrors = validateForm(replyFormData);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newReply: Comment = {
      id: `${parentId}-${Date.now()}`,
      name: replyFormData.name,
      email: replyFormData.email,
      content: replyFormData.comment,
      timestamp: new Date(),
      likes: 0,
      dislikes: 0,
    };

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        return comment;
      })
    );

    setReplyFormData({ name: "", email: "", comment: "", rememberMe: false });
    setReplyingTo(null);
    setIsSubmitting(false);
  };

  const handleLike = async (
    commentId: string,
    isReply = false,
    parentId?: string
  ) => {
    // Mock like functionality
    if (!isReply) {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, likes: comment.likes + 1, isLiked: true }
            : comment
        )
      );
    } else {
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies?.map((reply) =>
                reply.id === commentId
                  ? { ...reply, likes: reply.likes + 1, isLiked: true }
                  : reply
              ),
            };
          }
          return comment;
        })
      );
    }
  };

  const handleDislike = async (
    commentId: string,
    isReply = false,
    parentId?: string
  ) => {
    // Mock dislike functionality
    if (!isReply) {
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? { ...comment, dislikes: comment.dislikes + 1, isDisliked: true }
            : comment
        )
      );
    } else {
      setComments((prev) =>
        prev.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies?.map((reply) =>
                reply.id === commentId
                  ? { ...reply, dislikes: reply.dislikes + 1, isDisliked: true }
                  : reply
              ),
            };
          }
          return comment;
        })
      );
    }
  };

  const CommentItem = ({
    comment,
    isReply = false,
    parentId,
  }: {
    comment: Comment;
    isReply?: boolean;
    parentId?: string;
  }) => (
    <div
      className={`${isReply ? "ml-8 border-l-2 border-gray-700 pl-6" : ""} mb-8`}
    >
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-[#fcee16] rounded-full flex items-center justify-center flex-shrink-0">
          <User size={18} className="text-[#1b1a1b]" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-white font-open-sans">
              {comment.name}
            </span>
            <span className="text-gray-400 text-sm font-open-sans">
              {formatTimeAgo(comment.timestamp)}
            </span>
          </div>

          <p className="text-gray-200 mb-4 leading-relaxed font-open-sans">
            {comment.content}
          </p>

          <div className="flex items-center gap-6 text-sm mb-4">
            <button
              onClick={() => handleLike(comment.id, isReply, parentId)}
              className={`flex items-center gap-2 transition-colors duration-200 ${
                comment.isLiked
                  ? "text-[#fcee16]"
                  : "text-gray-400 hover:text-[#fcee16]"
              }`}
            >
              <ThumbsUp size={16} />
              <span className="font-open-sans">{comment.likes}</span>
            </button>

            <button
              onClick={() => handleDislike(comment.id, isReply, parentId)}
              className={`flex items-center gap-2 transition-colors duration-200 ${
                comment.isDisliked
                  ? "text-red-400"
                  : "text-gray-400 hover:text-red-400"
              }`}
            >
              <ThumbsDown size={16} />
              {comment.dislikes > 0 && (
                <span className="font-open-sans">{comment.dislikes}</span>
              )}
            </button>

            {!isReply && (
              <button
                onClick={() =>
                  setReplyingTo(replyingTo === comment.id ? null : comment.id)
                }
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

          {replyingTo === comment.id && (
            <div className="mt-6 p-6 bg-gray-800/50 rounded-lg border border-gray-700">
              <h4 className="text-lg font-bold text-white mb-4 font-roboto">
                Reply to {comment.name}
              </h4>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitReply(comment.id);
                }}
                className="space-y-4"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={replyFormData.name}
                      onChange={(e) =>
                        handleReplyInputChange("name", e.target.value)
                      }
                      placeholder="Name: *"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:border-[#fcee16] focus:outline-none font-open-sans"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      value={replyFormData.email}
                      onChange={(e) =>
                        handleReplyInputChange("email", e.target.value)
                      }
                      placeholder="Email: *"
                      className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:border-[#fcee16] focus:outline-none font-open-sans"
                      required
                    />
                  </div>
                </div>

                <textarea
                  value={replyFormData.comment}
                  onChange={(e) =>
                    handleReplyInputChange("comment", e.target.value)
                  }
                  placeholder="Write your reply..."
                  className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-gray-200 placeholder-gray-400 focus:border-[#fcee16] focus:outline-none resize-none font-open-sans"
                  rows={4}
                  required
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`remember-reply-${comment.id}`}
                      checked={replyFormData.rememberMe}
                      onChange={(e) =>
                        handleReplyInputChange("rememberMe", e.target.checked)
                      }
                      className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-[#fcee16] focus:ring-2"
                    />
                    <label
                      htmlFor={`remember-reply-${comment.id}`}
                      className="text-sm text-gray-300 font-open-sans"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyFormData({
                          name: "",
                          email: "",
                          comment: "",
                          rememberMe: false,
                        });
                      }}
                      className="px-4 py-2 bg-gray-700 text-gray-200 rounded font-medium hover:bg-gray-600 transition-colors duration-200 font-open-sans"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2 bg-[#fcee16] text-[#1b1a1b] rounded font-medium hover:bg-[#fcee16]/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-open-sans flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>Posting...</>
                      ) : (
                        <>
                          <Send size={16} />
                          Post Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-6">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  isReply={true}
                  parentId={comment.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const totalComments = comments.reduce(
    (total, comment) => total + 1 + (comment.replies?.length || 0),
    0
  );

  return (
    <div className="mt-16 pt-8 border-t border-gray-800">
      {/* Comments Header */}
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle size={24} className="text-[#fcee16]" />
        <h3 className="text-2xl font-bold text-white font-roboto">
          Comments ({totalComments})
        </h3>
      </div>

      {/* Leave a Reply Form */}
      <div className="mb-12">
        <h3 className="text-xl font-bold text-white mb-6 font-roboto uppercase tracking-wider">
          LEAVE A REPLY
        </h3>

        <form onSubmit={handleSubmitComment} className="space-y-6">
          {/* Comment Textarea */}
          <div>
            <textarea
              value={formData.comment}
              onChange={(e) => handleInputChange("comment", e.target.value)}
              placeholder="Comment:"
              className={`w-full p-4 bg-gray-800 border rounded text-gray-200 placeholder-gray-400 focus:outline-none resize-none font-open-sans ${
                errors.comment
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-600 focus:border-[#fcee16]"
              }`}
              rows={6}
              required
            />
            {errors.comment && (
              <p className="text-red-400 text-sm mt-2 font-open-sans">
                {errors.comment}
              </p>
            )}
          </div>

          {/* Name and Email Fields */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Name: *"
                className={`w-full p-4 bg-gray-800 border rounded text-gray-200 placeholder-gray-400 focus:outline-none font-open-sans ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-600 focus:border-[#fcee16]"
                }`}
                required
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-2 font-open-sans">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Email: *"
                className={`w-full p-4 bg-gray-800 border rounded text-gray-200 placeholder-gray-400 focus:outline-none font-open-sans ${
                  errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-600 focus:border-[#fcee16]"
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-2 font-open-sans">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Remember Me and Submit */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember-me"
                checked={formData.rememberMe}
                onChange={(e) =>
                  handleInputChange("rememberMe", e.target.checked)
                }
                className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-[#fcee16] focus:ring-2"
              />
              <label
                htmlFor="remember-me"
                className="text-gray-300 font-open-sans"
              >
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 border-2 border-[#fcee16] text-[#fcee16] hover:bg-[#fcee16] hover:text-[#1b1a1b] font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-open-sans flex items-center gap-2"
            >
              {isSubmitting ? (
                <>Posting Comment...</>
              ) : (
                <>
                  <Send size={16} />
                  Post Comment
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg font-open-sans mb-2">
              No comments yet
            </p>
            <p className="text-gray-500 font-open-sans">
              Be the first to share your thoughts!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>

      {/* Load More Comments */}
      {comments.length > 0 && (
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded font-medium transition-colors duration-200 border border-gray-700 hover:border-[#fcee16]/50 font-open-sans">
            Load More Comments
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
