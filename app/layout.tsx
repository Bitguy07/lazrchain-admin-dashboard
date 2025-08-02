
import { Providers } from '@/store/provider';
import '@/app/globals.css';
import { Inter } from 'next/font/google'

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
    <head>
     <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
    </head>
      <body className="font-sans">
        <Providers>
            <TooltipProvider>
              <Toaster />
              <Sonner />
                    {children}
            </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
