import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Heart, MessageCircle, Share2, Sparkles, Send, Play, Quote, Users, Video } from 'lucide-react';
import { ForumPost } from '../types';
import ClaraThumbnail from '../assets/images/regenerated_image_1782893632878.webp';

export default function SurvivorsView() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [commentsInputs, setCommentsInputs] = useState<{ [postId: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const videoTestimonials = [
    {
      title: "Clara's Story: Early Mammogram Saved Me",
      duration: "04:32",
      speaker: "Clara Mendez (In remission)",
      thumbnail: ClaraThumbnail,
      transcript: "I remember when the doctor told me the mammography showed anomalous density. My heart sank. But because we caught it at Stage IA, the localized surgery removed the margins cleanly. Modern screenings are an absolute lifesaver. Please do not wait until you feel pain—pain is often a late indicator."
    },
    {
      title: "Chemotherapy & Mutual Sisterhood",
      duration: "06:15",
      speaker: "Samantha Knowles (Survivor)",
      thumbnail: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400",
      transcript: "Chemo is undoubtedly a difficult phase physically. But what pulled me through was the community circle. We met every Tuesday, discussed dietary tips, and walked under the morning sun. The absolute lesson of cancer is that you don't fight it alone—the circle is your strength."
    }
  ];

  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/forum");
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (err) {
      console.error("Error loading forum posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch("/api/forum/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, likes: data.likes, likedBy: data.likedBy };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  const handlePostComment = async (postId: string) => {
    const text = commentsInputs[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await fetch("/api/forum/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, content: text })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(posts.map(p => {
          if (p.id === postId) {
            return { ...p, comments: data.comments };
          }
          return p;
        }));
        setCommentsInputs({ ...commentsInputs, [postId]: "" });
      } else {
        alert(data.error || "Failed to submit comment.");
      }
    } catch (err) {
      console.error("Comment submission error:", err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/forum/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, content: newContent })
      });
      const data = await res.json();
      if (data.success) {
        setPosts([data.post, ...posts]);
        setNewTitle("");
        setNewContent("");
        setMessage("Your post has been shared successfully in the sisterhood circle!");
        setTimeout(() => setMessage(""), 5000);
      } else {
        alert(data.error || "Failed to post. Please ensure you are logged in.");
      }
    } catch (err) {
      console.error("Create post error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = (postTitle: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Check out Clara's inspiring story of survival on Femora Care: "${postTitle}"`);
      alert("A shareable link and citation have been copied to your clipboard! Share the inspiration.");
    } else {
      alert(`Sharing: "${postTitle}". Spread awareness, save lives.`);
    }
  };

  return (
    <div className="space-y-16 py-4">
      {/* Header */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <span className="bg-[#FFF5F8] text-[#EC407A] border border-[#F8BBD0]/30 font-medium text-xs tracking-wider uppercase px-3 py-1 rounded-full">Sisterhood Circle</span>
        <h1 className="text-4xl font-heading font-extrabold text-[#4A1D2C] tracking-tight">
          Stories of Survival <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EC407A] to-[#F06292]">& Collective Strength</span>
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Connecting breast cancer survivors, individuals undergoing treatment, clinical caretakers, and advocates. Share stories, log comments, and build an unbreakable protective shield.
        </p>
      </section>

      {/* Video Diaries Grid */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Video className="w-5 h-5 text-[#EC407A]" />
          <h2 className="text-xl font-heading font-extrabold text-[#4A1D2C]">Video Journals & Testimonials</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videoTestimonials.map((vid, idx) => (
            <div key={idx} className="glass-panel rounded-3xl overflow-hidden bg-white/95 border border-[#F8BBD0]/20 flex flex-col">
              <div className="h-52 relative overflow-hidden group">
                <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={() => setActiveVideo(activeVideo === idx ? null : idx)}
                    className="w-14 h-14 bg-[#EC407A]/90 text-white rounded-full flex items-center justify-center hover:bg-[#D81B60] transition-all hover:scale-110 shadow-lg cursor-pointer"
                  >
                    <Play className="w-6 h-6 fill-white ml-1" />
                  </button>
                </div>
                <span className="absolute bottom-4 right-4 bg-black/70 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {vid.duration}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-heading font-bold text-[#4A1D2C] text-base">{vid.title}</h3>
                  <p className="text-xs text-[#EC407A] font-semibold">{vid.speaker}</p>
                </div>
                
                {activeVideo === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-4 p-4 bg-pink-50/50 rounded-2xl border border-[#F8BBD0]/25 text-xs text-slate-600 leading-relaxed italic"
                  >
                    <Quote className="w-4 h-4 text-[#EC407A] mb-1" />
                    "{vid.transcript}"
                  </motion.div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form and Board Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Write Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-6 rounded-3xl bg-white/95 border border-[#F8BBD0]/20 space-y-6 sticky top-6">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-extrabold text-[#EC407A] tracking-wider uppercase bg-[#FFF5F8] border border-[#F8BBD0]/30 px-2.5 py-1 rounded-md">Share Your Journey</span>
              <h3 className="text-xl font-heading font-extrabold text-[#4A1D2C]">Speak to the Sisterhood</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Whether you are a survivor, clinical caretaker, advocate, or patient, your words can be the turning light for someone else.
              </p>
            </div>

            {message && (
              <div className="p-3 bg-emerald-50 border border-emerald-150 text-emerald-700 text-xs rounded-xl font-medium">
                {message}
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Post Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My biopsy milestone / Chemotherapy tips"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EC407A]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-600">Your Experience</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your story, emotional battles, surgical tips, dietary guides, or encouragement..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EC407A]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#EC407A] hover:bg-[#D81B60] text-white font-semibold text-xs py-3 rounded-xl transition shadow-lg shadow-[#EC407A]/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> {submitting ? "Sharing..." : "Publish to Circle"}
              </button>
            </form>
          </div>
        </div>

        {/* Board Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-extrabold text-[#4A1D2C] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#EC407A]" /> Circle Discussion Board
            </h2>
            <button
              onClick={fetchPosts}
              className="text-xs text-[#EC407A] font-semibold hover:text-[#D81B60] transition cursor-pointer"
            >
              Refresh Board
            </button>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(n => (
                <div key={n} className="bg-white/80 border border-brand-100 p-6 rounded-3xl space-y-3 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-3 w-1/4 bg-slate-200 rounded" />
                      <div className="h-2 w-1/6 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="h-4 w-3/4 bg-slate-200 rounded" />
                  <div className="h-10 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 glass-panel rounded-3xl bg-white/50 border border-brand-200/30">
              <p className="text-xs text-slate-500 font-medium">No posts registered yet in the Circle. Be the first to share your journey!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map((post) => (
                <motion.article
                  key={post.id}
                  layout
                  className="glass-panel p-6 md:p-8 rounded-3xl bg-white border border-brand-200/20 shadow-md space-y-6"
                >
                  {/* Author detail */}
                  <div className="flex items-center gap-3">
                    <img src={post.avatar} alt={post.author} className="w-11 h-11 rounded-full object-cover object-center ring-2 ring-[#F8BBD0]/40" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-heading font-bold text-[#4A1D2C] text-sm">{post.author}</h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                        <span className="text-[#EC407A] bg-[#FFF5F8] border border-[#F8BBD0]/30 px-2 py-0.5 rounded">{post.role}</span>
                        <span>•</span>
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Post title & content */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-heading font-extrabold text-[#4A1D2C]">{post.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  </div>

                  {/* Post metrics / interactions */}
                  <div className="flex items-center gap-6 border-y border-slate-50 py-3 text-slate-500 text-xs">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-1.5 font-semibold transition cursor-pointer ${
                        post.likedBy?.includes("user-1") // Jane Doe mock
                          ? "text-[#EC407A] scale-105"
                          : "hover:text-[#EC407A]"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.likedBy?.includes("user-1") ? 'fill-[#EC407A] text-[#EC407A]' : ''}`} />
                      <span>{post.likes} Likes</span>
                    </button>
                    
                    <div className="flex items-center gap-1.5">
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments?.length || 0} Comments</span>
                    </div>

                    <button
                      onClick={() => handleShare(post.title)}
                      className="flex items-center gap-1.5 hover:text-slate-800 transition font-semibold"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share Story</span>
                    </button>
                  </div>

                  {/* Comments Display list */}
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3 items-start text-xs border-b border-slate-100/40 pb-3 last:border-b-0 last:pb-0">
                          <img src={comment.avatar} alt={comment.author} className="w-7 h-7 rounded-full object-cover object-center mt-0.5" referrerPolicy="no-referrer" />
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 text-[11px]">{comment.author}</span>
                              <span className="text-[9px] text-slate-400">{new Date(comment.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-[11px]">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Post Comment input */}
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      placeholder="Add an encouraging word or question for the survivor circle..."
                      value={commentsInputs[post.id] || ""}
                      onChange={(e) => setCommentsInputs({ ...commentsInputs, [post.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handlePostComment(post.id);
                      }}
                      className="flex-1 text-xs px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#EC407A] bg-slate-50/50"
                    />
                    <button
                      onClick={() => handlePostComment(post.id)}
                      className="bg-[#FFF5F8] text-[#EC407A] hover:bg-[#EC407A] hover:text-white border border-[#F8BBD0]/30 px-3 py-2.5 rounded-xl transition flex items-center justify-center text-xs font-semibold cursor-pointer"
                    >
                      Comment
                    </button>
                  </div>

                </motion.article>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
