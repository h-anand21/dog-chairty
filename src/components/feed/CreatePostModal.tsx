import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { X, Camera, Sparkles, Image as ImageIcon } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { dogs, createPost } = useApp();
  const { playSuccessChime, playPawPop } = useAudio();

  const [selectedDogId, setSelectedDogId] = useState(dogs[0]?.id || '');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000&auto=format&fit=crop&q=80');
  const [caption, setCaption] = useState('Enjoying afternoon zoomies at the dog park! 🐾☀️');
  const [tagsInput, setTagsInput] = useState('#HappyDog, #ParkDay, #PawConnect');

  if (!isOpen) return null;

  const samplePhotos = [
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=1000&auto=format&fit=crop&q=80',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessChime();

    const tags = tagsInput.split(',').map(t => {
      const clean = t.trim();
      return clean.startsWith('#') ? clean : `#${clean}`;
    }).filter(Boolean);

    createPost(imageUrl, caption, tags, selectedDogId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white rounded-4xl p-6 sm:p-8 shadow-2xl border border-obsidian-300 animate-in fade-in zoom-in-95 duration-200 text-left">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-obsidian-300 hover:bg-obsidian-400 flex items-center justify-center text-obsidian-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 text-coral-600 font-bold text-xs mb-2">
            <Camera className="w-3.5 h-3.5" />
            <span>PawFeed Community</span>
          </div>
          <h3 className="text-2xl font-black font-display text-obsidian-900">
            Share a Dog Moment 🐾
          </h3>
          <p className="text-xs text-obsidian-600 mt-1">
            Post photos of playtime, walks, training triumphs, and joyful puppy moments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-obsidian-900 mb-1">
              Select Dog Profile *
            </label>
            <select
              value={selectedDogId}
              onChange={e => setSelectedDogId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400 text-xs font-bold outline-hidden bg-white"
            >
              {dogs.map(d => (
                <option key={d.id} value={d.id}>
                  🐶 {d.name} ({d.breed})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-obsidian-900 mb-1">
              Select Photo Preset or Paste URL *
            </label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {samplePhotos.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    playPawPop();
                    setImageUrl(url);
                  }}
                  className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                    imageUrl === url ? 'border-coral-500 scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl border border-obsidian-400 text-xs outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-obsidian-900 mb-1">
              Caption *
            </label>
            <textarea
              rows={2}
              required
              value={caption}
              onChange={e => setCaption(e.target.value)}
              placeholder="What happened today? (e.g. Mastered fetch, beach trip...)"
              className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400 text-xs outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-obsidian-900 mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="#GoldenRetriever, #Playtime, #PawConnect"
              className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400 text-xs outline-hidden"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-obsidian-400 text-xs font-bold text-obsidian-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold shadow-soft transition-all"
            >
              Share Post 🐾
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
