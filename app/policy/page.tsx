"use client";
import React from 'react';
import { motion } from 'framer-motion';
import Footer from '@/components/layout/Footer';

export default function PrivacyPolicy() {
  return (
    <>
    <div className="bg-gradient-to-b from-white to-purple-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="bg-purple-600 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="text-purple-100 mt-2">Last Updated: February 27, 2025</p>
        </div>
        
        <div className="p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
            <p className="text-gray-600">
              Welcome to NoteSync (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). We respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, and safeguard your information when you use our NoteSync application.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium text-purple-700 mb-2">Personal Information</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>Account Information: Email address and password when you create an account</li>
                <li>Profile Information: Name and profile picture (optional)</li>
              </ul>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-medium text-purple-700 mb-2">Content Information</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>Notes: The content of notes you create, edit, and store</li>
                <li>Usage Data: How you interact with our application</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-medium text-purple-700 mb-2">Technical Information</h3>
              <ul className="list-disc pl-6 text-gray-600 space-y-1">
                <li>Device Information: Browser type, operating system, device type</li>
                <li>Log Data: IP address, access times, pages viewed</li>
              </ul>
            </div>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Provide and maintain the NoteSync service</li>
              <li>Authenticate your account and protect your data</li>
              <li>Improve and personalize your experience</li>
              <li>Respond to your inquiries and provide support</li>
              <li>Detect and prevent fraudulent activity</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Storage and Security</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Your notes and personal information are stored securely on Supabase&apos;s infrastructure</li>
              <li>We implement appropriate technical and organizational measures to protect your data</li>
              <li>Data is encrypted during transmission and at rest</li>
              <li>We only retain your data for as long as necessary to provide you with the service</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Sharing</h2>
            <p className="text-gray-600 mb-4">We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li><strong>Service Providers</strong>: Who help us provide the service (e.g., hosting providers)</li>
              <li><strong>Legal Requirements</strong>: When required by law or to protect our rights</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
            <p className="text-gray-600 mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to our processing of your data</li>
              <li>Export your notes and data</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Children&apos;s Privacy</h2>
            <p className="text-gray-600">
              NoteSync is not intended for children under 13. We do not knowingly collect information from children under 13.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Consent</h2>
            <p className="text-gray-600">
              By using NoteSync, you consent to our Privacy Policy and agree to its terms.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
    <Footer/>
        </>
  );
}