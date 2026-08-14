import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import {
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Send,
  Sparkles,
} from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { currentUser, likePost, addPostComment } = useApp();
  const { playPawPop, playDogBark } = useAudio();

  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const isLiked = currentUser ? post.likedBy.includes(currentUser.id) : false;

  const handleDoubleClick = () => {
    playDogBark();
    if (!isLiked) {
      likePost(post.id);
    }
    setShowHeartBurst(true);
    setTimeout(() => {
      setShowHeartBurst(false);
    }, 900);
  };

  const handleLikeClick = () => {
    playPawPop();
    likePost(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    playPawPop();
    addPostComment(post.id, commentText.trim());
    setCommentText('');
  };

  const handleShare = () => {
    playPawPop();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="glass-card rounded-4xl border border-white shadow-elevated overflow-hidden text-left space-y-4">
      
      {/* Post Author Header */}
      <div className="p-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.dogAvatar}
            alt={post.dogName}
            className="w-12 h-12 rounded-2xl object-cover ring-2 ring-coral-400 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black text-obsidian-950">
                {post.dogName} 🐾
              </h3>
              <span className="text-xs text-obsidian-500 font-bold">• {post.dogBreed}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-obsidian-500 font-medium">
              <MapPin className="w-3 h-3 text-coral-500" />
              <span>{post.location}</span>
              <span>•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="w-9 h-9 rounded-full bg-obsidian-100 hover:bg-obsidian-200 flex items-center justify-center text-obsidian-700 transition-colors cursor-pointer"
          title="Share Post"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Image with Double-Tap Heart Burst */}
      <div
        onDoubleClick={handleDoubleClick}
        className="relative w-full aspect-square sm:aspect-4/3 max-h-[520px] overflow-hidden bg-obsidian-950 select-none cursor-pointer group"
      >
        <img
          src={post.image}
          alt="Post"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
        />

        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="relative">
                <Heart className="w-28 h-28 text-rose-500 fill-rose-500 drop-shadow-2xl animate-pulse" />
                <span className="absolute inset-0 flex items-center justify-center text-4xl">
                  🐾
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {copiedLink && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs font-bold px-4 py-2 rounded-full backdrop-blur-md shadow-lg">
            ✓ Post link copied to clipboard!
          </div>
        )}
      </div>

      {/* Action Buttons & Like Counter */}
      <div className="px-5 sm:px-7 space-y-3 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1.5 text-xs font-extrabold transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                isLiked ? 'text-rose-600' : 'text-obsidian-700 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{post.likes.toLocaleString()} Likes</span>
            </button>

            <button
              onClick={() => {
                playPawPop();
                setShowComments(!showComments);
              }}
              className="flex items-center gap-1.5 text-xs font-extrabold text-obsidian-700 hover:text-coral-500 transition-colors cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments.length} Comments</span>
            </button>

          </div>

          <span className="text-[11px] text-obsidian-400 font-semibold italic">
            Double tap photo to like 🐾
          </span>
        </div>

        {/* Post Caption */}
        <div className="text-xs sm:text-sm text-obsidian-800 leading-relaxed font-normal">
          <span className="font-black text-obsidian-950 mr-2">{post.dogName}</span>
          <span>{post.caption}</span>
          
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags.map((t, idx) => (
              <span key={idx} className="text-xs font-extrabold text-coral-600 hover:underline cursor-pointer">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Comments Drawer */}
        {showComments && (
          <div className="pt-3 border-t border-obsidian-200 space-y-3 animate-in fade-in duration-150">
            <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
              {post.comments.length === 0 ? (
                <p className="text-xs text-obsidian-400 py-3 text-center font-medium">
                  Be the first pup friend to leave a comment! 🐾
                </p>
              ) : (
                post.comments.map(c => (
                  <div key={c.id} className="flex items-start gap-2.5 text-xs">
                    <img
                      src={c.userAvatar}
                      alt={c.userName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5 ring-1 ring-coral-300"
                    />
                    <div className="bg-obsidian-100 p-3 rounded-2xl flex-1 border border-obsidian-200">
                      <div className="flex items-center justify-between font-black text-obsidian-950">
                        <span>{c.userName}</span>
                        <span className="text-[10px] text-obsidian-400 font-normal">{c.timestamp}</span>
                      </div>
                      <p className="text-obsidian-800 mt-0.5 font-medium">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a friendly bark / comment..."
                className="flex-1 px-4 py-2.5 rounded-2xl bg-obsidian-100 border border-obsidian-200 focus:bg-white focus:border-coral-500 text-xs outline-hidden font-medium"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-5 py-2.5 rounded-2xl btn-primary disabled:opacity-50 text-white text-xs font-black shadow-glow-coral cursor-pointer"
              >
                Post
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
