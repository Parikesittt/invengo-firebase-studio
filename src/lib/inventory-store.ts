
"use client";

import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  currentStock: number;
  minStock: number;
  unitPrice: number;
  lastUpdated: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Beras Premium 5kg',
    description: 'Beras kualitas super pulen',
    category: 'Sembako',
    currentStock: 45,
    minStock: 10,
    unitPrice: 65000,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Minyak Goreng 2L',
    description: 'Minyak goreng kelapa sawit',
    category: 'Sembako',
    currentStock: 8,
    minStock: 15,
    unitPrice: 34000,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Gula Pasir 1kg',
    description: 'Gula kristal putih premium',
    category: 'Sembako',
    currentStock: 100,
    minStock: 20,
    unitPrice: 16000,
    lastUpdated: new Date().toISOString(),
  },
];

export function useInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('inventaris-ku-products');
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
    }
    setIsLoading(false);
  }, []);

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('inventaris-ku-products', JSON.stringify(newProducts));
  };

  const addProduct = (product: Omit<Product, 'id' | 'lastUpdated'>) => {
    const newProduct: Product = {
      ...product,
      id: Math.random().toString(36).substr(2, 9),
      lastUpdated: new Date().toISOString(),
    };
    saveProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Omit<Product, 'id'>>) => {
    const newProducts = products.map(p => 
      p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString() } : p
    );
    saveProducts(newProducts);
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    saveProducts(newProducts);
  };

  const updateStock = (id: string, amount: number) => {
    const newProducts = products.map(p => 
      p.id === id ? { ...p, currentStock: Math.max(0, p.currentStock + amount), lastUpdated: new Date().toISOString() } : p
    );
    saveProducts(newProducts);
  };

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
  };
}
