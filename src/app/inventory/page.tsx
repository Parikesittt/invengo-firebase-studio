
"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useInventory, Product } from "@/lib/inventory-store";
import { useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  ArrowUpDown,
  MoreVertical,
  Minus,
  Edit,
  Trash,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function InventoryPage() {
  const { products, isLoading, addProduct, updateProduct, deleteProduct, updateStock } = useInventory();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [stockAmount, setStockAmount] = useState<number>(0);
  
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    category: "",
    currentStock: 0,
    minStock: 5,
    unitPrice: 0,
  });

  useEffect(() => {
    if (searchParams.get("action") === "add") {
      setIsAddOpen(true);
    }
  }, [searchParams]);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    if (!newProduct.name) return;
    addProduct(newProduct);
    setIsAddOpen(false);
    setNewProduct({
      name: "",
      description: "",
      category: "",
      currentStock: 0,
      minStock: 5,
      unitPrice: 0,
    });
    toast({
      title: "Produk Ditambahkan",
      description: `${newProduct.name} telah berhasil masuk ke sistem.`,
    });
  };

  const handleStockUpdate = (isAdd: boolean) => {
    if (!selectedProduct) return;
    const finalAmount = isAdd ? Math.abs(stockAmount) : -Math.abs(stockAmount);
    updateStock(selectedProduct.id, finalAmount);
    setIsStockOpen(false);
    toast({
      title: "Stok Diperbarui",
      description: `Stok ${selectedProduct.name} kini adalah ${selectedProduct.currentStock + finalAmount}.`,
    });
  };

  if (isLoading) return <div className="p-8">Memuat data inventaris...</div>;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Daftar Inventaris</h1>
          <p className="text-muted-foreground">Monitor dan perbarui stok barang Anda.</p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
          onClick={() => setIsAddOpen(true)}
        >
          <Plus className="h-4 w-4" /> Tambah Produk
        </Button>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama produk atau kategori..."
              className="pl-10 bg-muted/30 border-none focus-visible:ring-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[300px]">Nama Produk</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Harga Satuan</TableHead>
                <TableHead className="text-center">Stok</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <TableRow key={product.id} className="group hover:bg-muted/10 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{product.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-1">{product.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      Rp {product.unitPrice.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="text-center font-bold">
                      {product.currentStock}
                    </TableCell>
                    <TableCell>
                      {product.currentStock <= product.minStock ? (
                        <Badge variant="destructive" className="bg-destructive/10 text-destructive border-none">Stok Rendah</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-none">Tersedia</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsStockOpen(true);
                          }}
                        >
                          <Plus className="h-4 w-4 text-accent" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsStockOpen(true);
                          }}
                        >
                          <Minus className="h-4 w-4 text-destructive" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteProduct(product.id)}>
                          <Trash className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    Tidak ada produk ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Tambah Produk Baru</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama Produk</Label>
              <Input 
                id="name" 
                value={newProduct.name} 
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Kategori</Label>
              <Input 
                id="category" 
                value={newProduct.category} 
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="stock">Stok Awal</Label>
                <Input 
                  id="stock" 
                  type="number"
                  value={newProduct.currentStock} 
                  onChange={(e) => setNewProduct({...newProduct, currentStock: parseInt(e.target.value) || 0})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="min">Min. Stok</Label>
                <Input 
                  id="min" 
                  type="number"
                  value={newProduct.minStock} 
                  onChange={(e) => setNewProduct({...newProduct, minStock: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Harga Satuan (Rp)</Label>
              <Input 
                id="price" 
                type="number"
                value={newProduct.unitPrice} 
                onChange={(e) => setNewProduct({...newProduct, unitPrice: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Batal</Button>
            <Button className="bg-accent text-accent-foreground" onClick={handleAddProduct}>Simpan Produk</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stock Update Dialog */}
      <Dialog open={isStockOpen} onOpenChange={setIsStockOpen}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader>
            <DialogTitle>Pembaruan Stok</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Produk</p>
              <p className="font-bold text-lg">{selectedProduct?.name}</p>
              <p className="text-xs text-muted-foreground mt-1">Stok saat ini: {selectedProduct?.currentStock}</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-center">Jumlah Barang</Label>
              <Input 
                id="amount" 
                type="number" 
                className="text-center text-xl font-bold h-12"
                value={stockAmount}
                onChange={(e) => setStockAmount(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                className="bg-accent text-accent-foreground h-12 gap-2"
                onClick={() => handleStockUpdate(true)}
              >
                <Plus className="h-4 w-4" /> Masuk
              </Button>
              <Button 
                variant="destructive" 
                className="h-12 gap-2"
                onClick={() => handleStockUpdate(false)}
              >
                <Minus className="h-4 w-4" /> Keluar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
