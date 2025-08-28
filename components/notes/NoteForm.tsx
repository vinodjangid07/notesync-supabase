import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface NoteFormProps {
  onSubmit: (data: { title: string; content: string; id?: string }) => void;
  initialData: { title: string; content: string; id?: string };
  onCancel?: () => void;
  type: 'create' | 'edit';
}

export default function NoteForm({ onSubmit, initialData, onCancel, type }: NoteFormProps) {
  const [note, setNote] = useState({ title: '', content: '' });
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isContentFocused, setIsContentFocused] = useState(false);
  
  useEffect(() => {
    setNote(initialData);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.title.trim() && note.content.trim()) {
      onSubmit(note);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-8"
    >
      <form onSubmit={handleSubmit} className="bg-background rounded-xl overflow-hidden border border-border">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
            {type === 'create' ? 'Create New Note' : 'Edit Note'}
          </h3>
          
          <div className="relative mb-4">
            <motion.div 
              className={`absolute -inset-0.5 rounded-lg blur opacity-30 transition duration-200 ${isTitleFocused ? 'opacity-100' : 'opacity-0'}`}
              animate={{ opacity: isTitleFocused ? 0.75 : 0 }}
            />
            <input
              type="text"
              value={note.title}
              placeholder="Note title"
              onChange={(e) => setNote({ ...note, title: e.target.value })}
              onFocus={() => setIsTitleFocused(true)}
              onBlur={() => setIsTitleFocused(false)}
              className="relative w-full px-4 py-3 bg-background border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          
          <div className="relative">
            <motion.div 
              className={`absolute -inset-0.5 rounded-lg blur opacity-30 transition duration-200 ${isContentFocused ? 'opacity-100' : 'opacity-0'}`}
              animate={{ opacity: isContentFocused ? 0.75 : 0 }}
            />
            <textarea
              value={note.content}
              placeholder="Write your note content here..."
              onChange={(e) => setNote({ ...note, content: e.target.value })}
              onFocus={() => setIsContentFocused(true)}
              onBlur={() => setIsContentFocused(false)}
              className="relative w-full px-4 py-3 bg-background border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all duration-200"
              rows={6}
              required
            />
          </div>
        </div>
        
        <div className="px-6 py-4 bg-background border-t border-border flex justify-end space-x-3">
          {onCancel && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-border text-gray-700 dark:text-gray-300 font-medium transition-colors"
            >
              Cancel
            </motion.button>
          )}
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2 bg-purple-600 text-white rounded-md font-medium hover:shadow-md transition-all duration-200"
          >
            {type === 'create' ? 'Create Note' : 'Save Changes'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}