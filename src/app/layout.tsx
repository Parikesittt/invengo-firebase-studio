
import type {Metadata} from 'next';
import './globals.css';
import {SidebarProvider, SidebarInset} from '@/components/ui/sidebar';
import {AppSidebar} from '@/components/layout/app-sidebar';
import {Toaster} from '@/components/ui/toaster';
import {FirebaseClientProvider} from '@/firebase/client-provider';
import {LanguageProvider} from '@/lib/i18n-context';

export const metadata: Metadata = {
  title: 'InvenGo - Solusi Pintar Inventaris UMKM',
  description: 'Kelola stok barang dan prediksi kebutuhan gudang dengan AI dalam satu genggaman.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <LanguageProvider>
          <FirebaseClientProvider>
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
          </FirebaseClientProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
