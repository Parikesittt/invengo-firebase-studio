"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, TrendingUp, Zap, Shield, ArrowRight, Sparkles } from "lucide-react";
import { useUser } from "@/firebase";
import Image from "next/image";

export default function LandingPage() {
  const { user } = useUser();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">InvenGo</span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/login?tab=register">Daftar Sekarang</Link>
              </Button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent-foreground text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4" />
          <span>Baru: Analisis Inventaris Berbasis AI</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 max-w-4xl">
          Kelola Inventaris UMKM Lebih <span className="text-accent">Cerdas</span> & Efisien
        </h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl">
          InvenGo membantu pemilik warung dan toko kecil memantau stok secara real-time, 
          mencegah kehabisan barang dengan prediksi AI, dan mengoptimalkan keuntungan.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 h-12 px-8">
            <Link href="/login?tab=register">
              Mulai Gratis <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="h-12 px-8">
            Lihat Demo
          </Button>
        </div>

        <div className="mt-16 relative w-full max-w-5xl aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border bg-muted">
          <Image 
            src="https://picsum.photos/seed/inv-hero/1200/675" 
            alt="Dashboard Preview" 
            fill 
            className="object-cover"
            data-ai-hint="dashboard interface"
          />
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Kenapa Memilih InvenGo?</h2>
            <p className="text-muted-foreground">Fitur lengkap yang dirancang khusus untuk kebutuhan pedagang.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Real-time Tracking",
                desc: "Update stok barang Anda seketika setiap ada transaksi masuk atau keluar."
              },
              {
                icon: TrendingUp,
                title: "AI Forecasting",
                desc: "Dapatkan prediksi kapan stok akan habis berdasarkan pola penjualan historis Anda."
              },
              {
                icon: Shield,
                title: "Multi-Store Ready",
                desc: "Siap dikembangkan untuk mengelola banyak cabang atau warung dalam satu akun."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="h-12 w-12 rounded-xl bg-accent/20 flex items-center justify-center mb-6">
                  <feature.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-primary rounded-3xl p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Siap Majukan Bisnis Anda?
          </h2>
          <p className="text-primary-foreground/80 mb-10 text-lg max-w-xl mx-auto">
            Bergabunglah dengan ribuan pemilik UMKM yang sudah mendigitalisasi inventaris mereka.
          </p>
          <Button size="lg" variant="secondary" asChild className="h-12 px-8 font-bold">
            <Link href="/login?tab=register">Buat Akun Sekarang</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-accent" />
            <span className="text-xl font-bold">InvenGo</span>
          </div>
          <div className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} InvenGo. Dibuat dengan ❤️ untuk UMKM Indonesia.
          </div>
        </div>
      </footer>
    </div>
  );
}
