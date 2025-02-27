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
      'from-blue-50 to-blue-100 border-blue-200',
      'from-green-50 to-green-100 border-green-200',
      'from-purple-50 to-purple-100 border-purple-200',
      'from-pink-50 to-pink-100 border-pink-200',
      'from-yellow-50 to-yellow-100 border-yellow-200',
      'from-indigo-50 to-indigo-100 border-indigo-200',
      'from-red-50 to-red-100 border-red-200',
      'from-orange-50 to-orange-100 border-orange-200',
      'from-teal-50 to-teal-100 border-teal-200',
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
      className={`relative h-64 rounded-xl shadow-sm bg-gradient-to-br ${getCardColor()} border overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col`}
      whileHover={{ y: -4 }}
    >
      <div className="p-5 flex-grow overflow-hidden">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-1 break-all">{note.title}</h3>
        <p className="text-gray-700 line-clamp-5 break-all">{note.content}</p>
      </div>
      
      <div className="px-5 py-3 bg-white bg-opacity-60 backdrop-blur-sm border-t flex justify-between items-center">
        <span className="text-xs text-gray-500 font-medium">
          {formatTimeAgo(note.created_at)}
        </span>
        
        <div className="space-x-1">
          {isConfirmingDelete ? (
            <>
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => onDelete()}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded"
              >
                Confirm
              </motion.button>
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsConfirmingDelete(false)}
                className="px-2 py-1 bg-gray-400 text-white text-xs rounded"
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
                className="p-1.5 rounded-full bg-black/10 hover:bg-gray-300 text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsConfirmingDelete(true)}
                className="p-1.5 rounded-full bg-red-200 hover:bg-red-600 text-gray-700 hover:text-gray-100 transition-colors"
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