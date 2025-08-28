"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
// import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from '@/components/layout/Footer';

export default function Home() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();
  // const router = useRouter();

  useEffect(() => {
    async function getUser() {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setIsLoading(false);
    }
    getUser();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };
  if (isLoading){
    return(
      <div className="bg-white min-h-screen"></div>
    )
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-background py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6">
                <span className="block">Capture your ideas,</span>{' '}
                <span className="block text-primary-600">anytime, anywhere.</span>
              </h1>
              <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
                NoteSync helps you organize your thoughts, save important information, and keep track of your tasks in one beautiful place. Access your notes from any device, anytime.
              </p>
              <div className="mt-10 flex space-x-0 md:space-x-4 flex-col md:flex-row">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link 
                    href={user ? "/notes" : "/sign-up"}
                    className="px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-secondary-600 shadow-md"
                  >
                    {user ? "View My Notes" : "Get Started Free"}
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-10 md:mt-0"
                >
                  <a 
                    href="#features" 
                    className="px-6 py-3 border border-border text-base font-medium rounded-md hover:bg-gray-50 shadow-sm"
                  >
                    Learn More
                  </a>
                </motion.div>
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12 lg:mt-0 flex justify-center"
            >
              <div className="relative rounded-xl overflow-hidden shadow-2xl max-w-md">
                <Image
                  src="/images/preview.png"
                  alt="NoteSync App Preview"
                  width={600}
                  height={400}
                  quality={90}
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 border border-gray-200 rounded-xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">Features</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Everything you need for your notes
            </h2>
            <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
              Organize, collaborate, and access your notes from anywhere.
            </p>
          </motion.div>

          <div className="mt-16 max-w-5xl mx-auto">
            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[
                {
                  title: "Simple & Intuitive",
                  description: "Clean interface that makes writing and organizing notes a breeze.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  ),
                },
                {
                  title: "Secure Storage",
                  description: "Your notes are encrypted and safely stored in the cloud.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                },
                {
                  title: "Access Anywhere",
                  description: "Sync across all your devices - desktop, tablet, and mobile.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  ),
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={item}
                  className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-purple-600 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* App Screenshot Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-sm font-semibold uppercase tracking-wider text-purple-600">Beautiful Design</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              A great experience on any device
            </h2>
            <p className="mt-4 text-xl text-gray-700 dark:text-gray-300">
              NoteSync&apos;s clean interface makes taking notes a pleasure, whether you&apos;re on desktop or mobile.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-200">
              <Image
                src="/images/preview.png"
                alt="NoteSync App Interface"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-purple-600 hidden sm:flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600">
        <div className="max-w-7xl mx-auto py-12 px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-0 lg:flex-1"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl" id="newsletter-headline">
              Ready to get started?
            </h2>
            <p className="mt-3 max-w-3xl text-lg leading-6 text-purple-100">
              Join thousands of users who organize their lives with NoteSync. Sign up for free and start creating your first note today.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 lg:mt-0 lg:ml-8"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link 
                href={user ? "/notes" : "/sign-up"}
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-purple-700 bg-white hover:bg-gray-50 shadow-md"
              >
                {user ? "Go to notes" : "Get started for free"}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}