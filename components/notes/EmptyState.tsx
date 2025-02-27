import React from 'react';
import { motion } from 'framer-motion';

interface EmptyStateProps {
  onCreateNote: () => void;
}

export default function EmptyState({ onCreateNote }: EmptyStateProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-12 mt-12 text-center bg-white rounded-xl shadow-sm border border-dashed border-gray-300"
    >
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-800 mb-2">No Notes Yet</h3>
      
      <p className="text-gray-600 mb-8 max-w-md">
        You haven&apos;t created any notes yet. Start by creating your first note to keep track of your ideas, tasks, or memories.
      </p>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onCreateNote}
        className="px-6 py-2 bg-purple-600 text-white rounded-md font-medium hover:shadow-md transition-all duration-200 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Create Your First Note
      </motion.button>
    </motion.div>
  );
}