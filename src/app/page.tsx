"use client";

import { useInventory } from "@/lib/inventory-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, AlertTriangle, TrendingDown, DollarSign, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { products, isLoading } = useInventory();

  if (isLoading) return <div className="p-8">Memuat data...</div>;

  const lowStockCount = products.filter(p => p.currentStock <= p.minStock).length;
  const totalItems = products.length;
  const totalValue = products.reduce((acc, p) => acc + (p.currentStock * p.unitPrice), 0);
  const outOfStockCount = products.filter(p => p.currentStock === 0).length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Ringkasan Inventaris</h1>
          <p className="text-muted-foreground">Kelola stok produk UMKM Anda dengan mudah.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/inventory">Lihat Semua</Link>
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            <Link href="/inventory?action=add">Tambah Produk</Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">Jenis barang di gudang</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Perlu segera dipesan ulang</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Habis Stok</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Produk tidak tersedia</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Nilai Inventaris</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              Rp {totalValue.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Estimasi nilai aset</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Stok Menipis</CardTitle>
            <CardDescription>Produk yang hampir mencapai batas minimum stok.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {products.filter(p => p.currentStock <= p.minStock).length > 0 ? (
                products.filter(p => p.currentStock <= p.minStock).map(product => (
                  <div key={product.id} className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={(product.currentStock / (product.minStock * 2)) * 100} className="h-1.5" />
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {product.currentStock} / {product.minStock} min
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                       <Link href={`/inventory?action=update&id=${product.id}`}>Pesan</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Semua stok aman saat ini.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Aktivitas Cepat</CardTitle>
            <CardDescription>Tindakan yang sering dilakukan.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start gap-2 h-12" asChild>
              <Link href="/inventory?action=add">
                <PlusCircle className="h-4 w-4 text-accent" />
                Input Produk Baru
              </Link>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-12" asChild>
               <Link href="/inventory?type=low">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Cek Stok Kritis
              </Link>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-12" asChild>
              <Link href="/analysis">
                <TrendingDown className="h-4 w-4 text-primary-foreground" />
                Prediksi AI
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
