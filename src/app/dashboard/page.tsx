
"use client";
export const dynamic = "force-dynamic";
import { useInventory } from "@/lib/inventory-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, AlertTriangle, TrendingDown, DollarSign, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "@/lib/i18n-context";

export default function Dashboard() {
  const { products, isLoading } = useInventory();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push("/login");
    }
  }, [user, isUserLoading, router]);

  if (isLoading || isUserLoading) return <div className="p-8">Memuat data...</div>;
  if (!user) return null;

  const lowStockCount = products.filter(p => p.currentStock <= p.minStock).length;
  const totalItems = products.length;
  const totalValue = products.reduce((acc, p) => acc + (p.currentStock * p.unitPrice), 0);
  const outOfStockCount = products.filter(p => p.currentStock === 0).length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.welcome', { name: user.displayName || user.email || 'User' })}</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            <Link href="/inventory?action=add">{t('inventory.add_btn')}</Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.total_products')}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('dashboard.items_desc')}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.low_stock')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('dashboard.low_stock_desc')}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.out_of_stock')}</CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{outOfStockCount}</div>
            <p className="text-xs text-muted-foreground mt-1">{t('dashboard.out_of_stock_desc')}</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.inventory_value')}</CardTitle>
            <DollarSign className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              Rp {totalValue.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{t('dashboard.value_desc')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="md:col-span-2 border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle>{t('dashboard.low_stock_list')}</CardTitle>
            <CardDescription>{t('dashboard.low_stock_list_desc')}</CardDescription>
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
                       <Link href={`/inventory?action=update&id=${product.id}`}>{t('dashboard.order')}</Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  {t('dashboard.all_safe')}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle>{t('dashboard.quick_actions')}</CardTitle>
            <CardDescription>{t('dashboard.quick_actions_desc')}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button variant="outline" className="justify-start gap-2 h-12" asChild>
              <Link href="/inventory?action=add">
                <PlusCircle className="h-4 w-4 text-accent" />
                {t('dashboard.add_product')}
              </Link>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-12" asChild>
               <Link href="/inventory?type=low">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                {t('dashboard.check_critical')}
              </Link>
            </Button>
            <Button variant="outline" className="justify-start gap-2 h-12" asChild>
              <Link href="/analysis">
                <TrendingDown className="h-4 w-4 text-primary-foreground" />
                {t('dashboard.ai_prediction')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
