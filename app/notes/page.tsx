"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import NotesList from "@/components/notes/NotesList";
import NoteForm from "@/components/notes/NoteForm";
import EmptyState from "@/components/notes/EmptyState";
import { motion, AnimatePresence } from "framer-motion";

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

export default function NotesPage() {
  const [user, setUser] = useState<any>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/sign-in");
        return;
      }
      setUser(session.user);
    }
    getUser();
  }, [router]);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  async function fetchNotes() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddNote(noteData: { title: string; content: string }) {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("notes")
        .insert([
          {
            title: noteData.title,
            content: noteData.content,
            user_id: user.id
          }
        ])
        .select();
      
      if (error) throw error;
      
      setNotes([data[0], ...notes]);
      setNewNote({ title: "", content: "" });
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  async function handleUpdateNote(updatedNote: { title: string; content: string; id?: string }) {
    if (!updatedNote.id) return;
    
    try {
      const { data, error } = await supabase
        .from("notes")
        .update({
          title: updatedNote.title,
          content: updatedNote.content
        })
        .eq("id", updatedNote.id)
        .select();
      
      if (error) throw error;
      
      setNotes(notes.map(note => note.id === updatedNote.id ? data[0] : note));
      setEditingNote(null);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  }

  async function handleDeleteNote(id: string) {
    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  function startEditing(note: Note) {
    setEditingNote(note);
    setIsFormOpen(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between mb-8 items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Notes</h1>
            <p className="text-gray-600 mt-1">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'} available
            </p>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsFormOpen(!isFormOpen);
              setEditingNote(null);
            }}
            className={`mt-4 md:mt-0 ${
              isFormOpen 
                ? "bg-gray-600 hover:bg-gray-700" 
                : "bg-purple-600 hover:shadow-lg"
            } text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center`}
          >
            {isFormOpen ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Note
              </>
            )}
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {isFormOpen && (
            <NoteForm 
              key="new-note-form"
              onSubmit={handleAddNote}
              initialData={{ title: "", content: "" }}
              type="create"
            />
          )}
            
          {editingNote && (
            <NoteForm 
              key={`edit-note-${editingNote.id}`}
              onSubmit={handleUpdateNote}
              initialData={editingNote}
              onCancel={() => setEditingNote(null)}
              type="edit"
            />
          )}
        </AnimatePresence>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden h-64 animate-pulse">
                <div className="p-5">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  <div className="absolute bottom-4 left-5">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notes.length === 0 ? (
          <EmptyState onCreateNote={() => setIsFormOpen(true)} />
        ) : (
          <NotesList 
            notes={notes} 
            onEdit={startEditing} 
            onDelete={handleDeleteNote} 
          />
        )}
      </div>
    </div>
  );
}