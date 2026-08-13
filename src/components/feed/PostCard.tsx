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
  Smile,
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

  const isLiked = post.likedBy.includes(currentUser.id);

  // Double click image to trigger like + animated heart particle
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
    <div className="bg-white rounded-3xl border border-obsidian-400/50 shadow-soft overflow-hidden text-left space-y-4">
      
      {/* Post Author Header */}
      <div className="p-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={post.dogAvatar}
            alt={post.dogName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-coral-400"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-black text-obsidian-900">
                {post.dogName} 🐾
              </h3>
              <span className="text-xs text-obsidian-500 font-semibold">• {post.dogBreed}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-obsidian-500">
              <MapPin className="w-3 h-3 text-coral-500" />
              <span>{post.location}</span>
              <span>•</span>
              <span>{post.createdAt}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="w-9 h-9 rounded-full bg-obsidian-300/60 hover:bg-obsidian-400/60 flex items-center justify-center text-obsidian-700 transition-colors"
          title="Share Post"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Image with Double-Tap Heart Burst */}
      <div
        onDoubleClick={handleDoubleClick}
        className="relative w-full aspect-square sm:aspect-4/3 max-h-[500px] overflow-hidden bg-obsidian-900 select-none cursor-pointer group"
      >
        <img
          src={post.image}
          alt="Post"
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
        />

        {/* Double-Click Heart + Paw Burst Animation */}
        <AnimatePresence>
          {showHeartBurst && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="relative">
                <Heart className="w-24 h-24 text-rose-500 fill-rose-500 drop-shadow-2xl animate-pulse" />
                <span className="absolute inset-0 flex items-center justify-center text-3xl">
                  🐾
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {copiedLink && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs font-bold px-4 py-1.5 rounded-full backdrop-blur-md">
            ✓ Link copied to clipboard!
          </div>
        )}
      </div>

      {/* Action Buttons & Like Counter */}
      <div className="px-4 sm:px-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            
            {/* Like Button */}
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 ${
                isLiked ? 'text-rose-600' : 'text-obsidian-700 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{post.likes.toLocaleString()} Likes</span>
            </button>

            {/* Comment Button */}
            <button
              onClick={() => {
                playPawPop();
                setShowComments(!showComments);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-obsidian-700 hover:text-coral-500 transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              <span>{post.comments.length} Comments</span>
            </button>

          </div>

          <span className="text-[11px] text-obsidian-400 font-medium italic">
            Double tap photo to like 🐾
          </span>
        </div>

        {/* Post Caption & Tags */}
        <div className="text-xs sm:text-sm text-obsidian-800 leading-relaxed">
          <span className="font-black text-obsidian-900 mr-2">{post.dogName}</span>
          <span>{post.caption}</span>
          
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags.map((t, idx) => (
              <span key={idx} className="text-xs font-bold text-coral-600 hover:underline cursor-pointer">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Comments Section Drawer */}
        {showComments && (
          <div className="pt-3 border-t border-obsidian-400/40 space-y-3 animate-in fade-in duration-150">
            <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
              {post.comments.length === 0 ? (
                <p className="text-xs text-obsidian-500 py-2 text-center">
                  Be the first pup friend to leave a comment! 🐾
                </p>
              ) : (
                post.comments.map(c => (
                  <div key={c.id} className="flex items-start gap-2.5 text-xs">
                    <img
                      src={c.userAvatar}
                      alt={c.userName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="bg-obsidian-300/40 p-2.5 rounded-2xl flex-1">
                      <div className="flex items-center justify-between font-bold text-obsidian-900">
                        <span>{c.userName}</span>
                        <span className="text-[10px] text-obsidian-400 font-normal">{c.timestamp}</span>
                      </div>
                      <p className="text-obsidian-800 mt-0.5">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment Input */}
            <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Add a friendly bark / comment..."
                className="flex-1 px-4 py-2 rounded-xl bg-obsidian-300/50 border border-obsidian-400/60 focus:bg-white focus:border-coral-500 text-xs outline-hidden"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 rounded-xl bg-coral-500 hover:bg-coral-600 disabled:opacity-50 text-white text-xs font-bold shadow-xs"
              >
                Post
              </button>
            </form>
          </div>
        )}

      </div>

      <div className="pb-2" />
    </div>
  );
};
