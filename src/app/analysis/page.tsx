
"use client";
import { useState } from "react";
import { useInventory } from "@/lib/inventory-store";
import { analyzeInventoryTrends, AnalyzeInventoryTrendsOutput } from "@/ai/flows/analyze-inventory-trends";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Calendar, Info, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AnalysisPage() {
  const { products, isLoading: isInvLoading } = useInventory();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalyzeInventoryTrendsOutput | null>(null);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Create mock historical data in CSV format based on current products
    // In a real app, this would come from a transaction history database
    const csvHeader = "date,product_name,stock_level\n";
    const csvData = products.map(p => {
        const today = new Date();
        const dates = [
            new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            today.toISOString().split('T')[0]
        ];
        return dates.map((d, i) => `${d},${p.name},${p.currentStock + (i * 10)}`).join('\n');
    }).join('\n');
    
    const historicalData = csvHeader + csvData;
    const productNames = products.map(p => p.name).join(', ');

    try {
      const response = await analyzeInventoryTrends({
        historicalData,
        products: productNames
      });
      setResults(response);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
            AI Inventory Analysis <Sparkles className="h-6 w-6 text-accent" />
          </h1>
          <p className="text-muted-foreground">Prediksi stok rendah berdasarkan tren historis penjualan Anda.</p>
        </div>
        <Button 
          onClick={handleRunAnalysis} 
          disabled={isAnalyzing || products.length === 0}
          className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2 h-11 px-6 shadow-sm"
        >
          {isAnalyzing ? (
            <> <Loader2 className="h-4 w-4 animate-spin" /> Menganalisis... </>
          ) : (
            <> <TrendingUp className="h-4 w-4" /> Jalankan Prediksi AI </>
          )}
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-none shadow-sm bg-white md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Cara Kerja</CardTitle>
            <CardDescription>Bagaimana AI membantu stok UMKM Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary-foreground font-bold text-sm">1</div>
              <p className="text-sm">AI mempelajari pola masuk dan keluar barang di gudang Anda selama beberapa periode terakhir.</p>
            </div>
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary-foreground font-bold text-sm">2</div>
              <p className="text-sm">Algoritma menghitung kecepatan penjualan untuk setiap jenis produk secara spesifik.</p>
            </div>
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary-foreground font-bold text-sm">3</div>
              <p className="text-sm">Prediksi tanggal stok kritis diberikan sehingga Anda punya waktu untuk memesan ulang.</p>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-1 lg:col-span-2">
          {results ? (
            <div className="grid gap-4">
              {results.predictions.map((pred, i) => (
                <Card key={i} className="border-none shadow-sm bg-white hover:border-accent/20 border transition-all overflow-hidden">
                  <div className="flex items-center p-4">
                    <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 mr-4">
                      <Calendar className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{pred.productName}</p>
                      <p className="text-xs text-muted-foreground">Estimasi Stok Kritis:</p>
                      <p className="font-bold text-primary-foreground mt-0.5">{pred.lowStockPrediction}</p>
                    </div>
                    <div className="ml-4">
                        <Badge variant="outline" className="bg-primary/10 border-none text-primary-foreground px-3">
                            Smart Prediction
                        </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-muted/20 rounded-3xl border-2 border-dashed border-muted p-12 text-center">
              <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                <Sparkles className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Mulai Analisis Pertama Anda</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mt-2">
                Klik tombol di atas untuk memproses data inventaris dan melihat prediksi cerdas dari AI.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
