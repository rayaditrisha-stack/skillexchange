import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, BookOpen, Zap, Sparkles, ExternalLink, X, ShieldCheck } from 'lucide-react';
import SkillBadge from './SkillBadge';

export default function SkillManagerModal({ isOpen, onClose, onRefresh }) {
  const { user, refreshUser, showToast } = useAuth();

  // Skill Offered state
  const [skillName, setSkillName] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [proofUrl, setProofUrl] = useState('');
  const [addOfferedLoading, setAddOfferedLoading] = useState(false);

  // Skill Needed (Wishlist) state
  const [newNeededTag, setNewNeededTag] = useState('');
  const [updateNeededLoading, setUpdateNeededLoading] = useState(false);

  if (!isOpen || !user) return null;

  // Add Offered Skill
  const handleAddOfferedSkill = async (e) => {
    e.preventDefault();
    if (!skillName.trim()) {
      showToast('Skill name is required.', 'error');
      return;
    }

    try {
      setAddOfferedLoading(true);
      const res = await axios.post('/api/users/skills-offered', {
        skillName: skillName.trim(),
        level,
        proofUrl: proofUrl.trim()
      });

      if (res.data.success) {
        showToast(res.data.message || `Added ${skillName} to offered skills!`, 'success');
        setSkillName('');
        setProofUrl('');
        await refreshUser();
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to add skill.', 'error');
    } finally {
      setAddOfferedLoading(false);
    }
  };

  // Add Needed Skill Tag
  const handleAddNeededTag = async () => {
    if (!newNeededTag.trim()) return;
    const currentList = user.skillsNeeded || [];
    if (currentList.includes(newNeededTag.trim())) {
      showToast(`${newNeededTag} is already on your wishlist.`, 'info');
      setNewNeededTag('');
      return;
    }

    const updated = [...currentList, newNeededTag.trim()];

    try {
      setUpdateNeededLoading(true);
      const res = await axios.put('/api/users/skills-needed', { skillsNeeded: updated });
      if (res.data.success) {
        showToast(`Added ${newNeededTag} to your wishlist!`, 'success');
        setNewNeededTag('');
        await refreshUser();
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update wishlist.', 'error');
    } finally {
      setUpdateNeededLoading(false);
    }
  };

  // Remove Needed Skill Tag
  const handleRemoveNeededTag = async (tagToRemove) => {
    const updated = (user.skillsNeeded || []).filter(t => t !== tagToRemove);
    try {
      setUpdateNeededLoading(true);
      const res = await axios.put('/api/users/skills-needed', { skillsNeeded: updated });
      if (res.data.success) {
        showToast(`Removed ${tagToRemove} from wishlist.`, 'info');
        await refreshUser();
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      showToast('Failed to remove tag.', 'error');
    } finally {
      setUpdateNeededLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card max-w-2xl w-full p-6 sm:p-8 rounded-3xl border border-slate-700 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Manage Teachable Skills & Wishlist</h3>
              <p className="text-xs text-slate-400">Dynamic updates reflect live in the Match Engine.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SECTION 1: Skills You Can Teach */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              What Can You Teach? (Skills Offered)
            </h4>
            <p className="text-xs text-slate-400">Add competencies and proof links to boost your peer match score.</p>
          </div>

          {/* Current Skills Offered */}
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered && user.skillsOffered.length > 0 ? (
              user.skillsOffered.map((sk, idx) => (
                <SkillBadge key={idx} skill={sk.skillName} level={sk.level} proofUrl={sk.proofUrl} verified={sk.verified} />
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No skills listed yet. Add one below!</span>
            )}
          </div>

          {/* Add Skill Offered Form */}
          <form onSubmit={handleAddOfferedSkill} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <p className="text-xs font-semibold text-slate-300">Add New Skill to Offer:</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                required
                placeholder="Skill name (e.g. Next.js, PyTorch)"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="sm:col-span-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-violet-500"
              />
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-violet-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <input
              type="url"
              placeholder="Proof / Portfolio URL (GitHub, Kaggle, Figma - optional)"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-violet-500"
            />

            <button
              type="submit"
              disabled={addOfferedLoading}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-xs text-emerald-400 transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              {addOfferedLoading ? 'Publishing...' : 'Publish Skill to Campus Mesh'}
            </button>
          </form>
        </div>

        {/* SECTION 2: What Do You Want to Learn (Wishlist) */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <div className="space-y-1">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-violet-400" />
              What Do You Want to Learn? (Wishlist)
            </h4>
            <p className="text-xs text-slate-400">Match engine uses these tags to find direct and 3-way circular barter cycles.</p>
          </div>

          {/* Current Wishlist Tags */}
          <div className="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-xl bg-slate-900/80 border border-slate-800">
            {user.skillsNeeded && user.skillsNeeded.length > 0 ? (
              user.skillsNeeded.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold"
                >
                  {tag}
                  <button
                    disabled={updateNeededLoading}
                    onClick={() => handleRemoveNeededTag(tag)}
                    className="hover:text-rose-400 transition-colors"
                  >
                    ✕
                  </button>
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">Wishlist empty. Add tags below!</span>
            )}
          </div>

          {/* Add Tag Form */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add wishlist tag (e.g. System Architecture, Docker)"
              value={newNeededTag}
              onChange={(e) => setNewNeededTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddNeededTag())}
              className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-violet-500"
            />
            <button
              type="button"
              disabled={updateNeededLoading}
              onClick={handleAddNeededTag}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold"
            >
              Add Tag
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
