import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  
  const getCardColor = () => {
    const colors = [
      'bg-card-1 border-purple-200/60 dark:border-purple-500/20 shadow-lg shadow-purple-100/40 dark:shadow-purple-900/30', 
      'bg-card-2 border-teal-200/60 dark:border-teal-500/20 shadow-lg shadow-teal-100/40 dark:shadow-teal-900/30', 
      'bg-card-3 border-blue-200/60 dark:border-blue-500/20 shadow-lg shadow-blue-100/40 dark:shadow-blue-900/30', 
      'bg-card-4 border-indigo-200/60 dark:border-indigo-500/20 shadow-lg shadow-indigo-100/40 dark:shadow-indigo-900/30', 
      'bg-card-5 border-sky-200/60 dark:border-sky-500/20 shadow-lg shadow-sky-100/40 dark:shadow-sky-900/30', 
      'bg-card-6 border-violet-200/60 dark:border-violet-500/20 shadow-lg shadow-violet-100/40 dark:shadow-violet-900/30', 
      'bg-card-7 border-emerald-200/60 dark:border-emerald-500/20 shadow-lg shadow-emerald-100/40 dark:shadow-emerald-900/30', 
      'bg-card-8 border-red-200/60 dark:border-red-500/20 shadow-lg shadow-red-100/40 dark:shadow-red-900/30', 
    ];
    
    const charCode = note.title.charCodeAt(0) || 0;
    const colorIndex = charCode % colors.length;
    return colors[colorIndex];
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  function formatTimeAgo(dateString: string) {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }

  return (
    <motion.div 
      variants={item}
      className={`relative h-64 rounded-2xl border-2 overflow-hidden backdrop-blur-sm transition-all duration-300 flex flex-col group ${getCardColor()}`}
      whileHover={{ 
        y: -6, 
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      style={{
        boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.1)"
      }}
    >
      <div className="p-6 flex-grow overflow-hidden">
        <h3 className="font-bold text-xl text-foreground mb-3 line-clamp-2 break-all leading-tight">{note.title}</h3>
        <p className="text-foreground/70 dark:text-foreground/60 line-clamp-4 break-all leading-relaxed text-sm">{note.content}</p>
      </div>
      
      <div className="px-6 py-4 bg-white/40 dark:bg-black/20 backdrop-blur-md border-t border-white/20 dark:border-white/10 flex justify-between items-center">
        <span className="text-xs text-foreground/60 dark:text-foreground/50 font-medium tracking-wide">
          {formatTimeAgo(note.created_at)}
        </span>
        
        <div className="flex space-x-2">
          {isConfirmingDelete ? (
            <>
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => onDelete()}
                className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-all duration-200 shadow-sm"
              >
                Confirm
              </motion.button>
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsConfirmingDelete(false)}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm"
              >
                Cancel
              </motion.button>
            </>
          ) : (
            <>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEdit}
                className="p-2 rounded-xl bg-white/60 dark:bg-black/40 hover:bg-white/80 dark:hover:bg-black/60 text-foreground/70 hover:text-foreground transition-all duration-200 shadow-sm backdrop-blur-sm border border-white/20 dark:border-white/10"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsConfirmingDelete(true)}
                className="p-2 rounded-xl bg-red-50/80 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-all duration-200 shadow-sm backdrop-blur-sm border border-red-200/30 dark:border-red-800/30"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}