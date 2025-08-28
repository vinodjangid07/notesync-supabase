"use client"
import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

function SignInForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    
    useEffect(() => {
        const message = searchParams?.get('message')
        if (message) {
            setMessage(message)
        }
    }, [searchParams])
    
    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)
        
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        
        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }
        
        router.push('/notes')
        router.refresh()
    }
    
    return (
        <div className="min-h-[89vh] flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}  
                className="max-w-md w-full space-y-8 p-8"
            >
                <div className="flex flex-col items-center">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ rotate: 10 }}
                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        className="bg-primary w-14 h-14 rounded-xl shadow-md flex items-center justify-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </motion.div>
                    
                    <h2 className="mt-4 text-center text-3xl font-bold text-foreground">
                        Sign in to NoteSync
                    </h2>
                    <p className="mt-2 text-center text-sm text-foreground/70">
                        Access your notes from anywhere
                    </p>
                </div>
                
                {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-lg text-sm border border-green-200 dark:border-green-800"
                    >
                        {message}
                    </motion.div>
                )}
                
                <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
                    {/* Form content - unchanged */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-border bg-background placeholder-foreground/50 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                                    Password
                                </label>
                                <Link href="/reset-password" className="text-xs text-primary hover:text-primary/80 transition-colors">
                                    Forgot your password?
                                </Link>
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-border bg-background placeholder-foreground/50 text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm transition-all duration-200"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-800"
                        >
                            {error}
                        </motion.div>
                    )}
                    
                    <div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm transition-all duration-200 disabled:opacity-70"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign in'}
                        </motion.button>
                    </div>
                    
                    <div className="flex items-center justify-center">
                        <div className="text-sm">
                            <Link href="/sign-up" className="font-medium text-primary hover:text-primary/80 transition-colors">
                                Need an account? Sign up
                            </Link>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    )
}

function SignInLoading() {
    return (
        <div className="min-h-[89vh] flex flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-8 flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-foreground/70">Loading...</p>
            </div>
        </div>
    )
}

export default function SignInPage() {
    return (
        <Suspense fallback={<SignInLoading />}>
            <SignInForm />
        </Suspense>
    )
}