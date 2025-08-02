'use client';

import Link from 'next/link';
import { Ghost, ArrowLeftCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground space-y-6">
      {/* Floating Ghost Icon */}
      <div className="bg-gradient-primary p-6 rounded-full shadow-xl animate-bounce">
        <Ghost className="w-12 h-12 text-primary-foreground" />
      </div>

      <h1 className="text-4xl sm:text-5xl pb-2 font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-pulse">
        Page Not Found
      </h1>

      <p className="text-muted-foreground text-center max-w-md">
        Whoops! Looks like you ventured into uncharted territory. This page doesn't exist or has been moved.
      </p>

      {/* Button Back to Login */}
      <Link
        href="/login"
        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 motion-safe:animate-fade-in"
      >
        <ArrowLeftCircle className="w-5 h-5 mr-2" />
        Back to Login
      </Link>
    </div>
  );
}
