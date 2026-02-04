import type {Metadata} from 'next';
import './globals.css';
import {SidebarProvider, SidebarInset} from '@/components/ui/sidebar';
import {AppSidebar} from '@/components/layout/app-sidebar';
import {Toaster} from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'InventarisKu - Solusi Manajemen Inventaris UMKM',
  description: 'Aplikasi manajemen inventaris yang sederhana dan intuitif untuk UMKM.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <SidebarInset className="flex flex-col">
              <main className="flex-1 overflow-y-auto">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
