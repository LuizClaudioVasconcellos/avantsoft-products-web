"use client";

import { useState } from "react";
import { Plus, RefreshCw, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import ProductList from "@/components/ProductList";
import ProductForm from "@/components/ProductForm";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/product";

export default function Home() {
  const {
    products,
    loading,
    error,
    addProduct,
    removeProduct,
    refreshProducts,
    editProduct,
  } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [productEdit, setProductEdit] = useState<Product | null>(null);

  const handleRefresh = async () => {
    await refreshProducts();
  };

  const handleNewProduct = () => {
    setProductEdit(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product | null) => {
    setProductEdit(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setProductEdit(null);
  };

  const isFormVisible = showForm || productEdit;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Package className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              Gerenciamento de Produtos
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Gerencie seu catálogo de produtos de forma simples e eficiente.
            Adicione, visualize e organize seus produtos em um só lugar.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Produtos</CardTitle>
                <CardDescription>
                  {products.length}{" "}
                  {products.length === 1
                    ? "produto cadastrado"
                    : "produtos cadastrados"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                  />
                  Atualizar
                </Button>
                <Button
                  onClick={isFormVisible ? handleCloseForm : handleNewProduct}
                  size="sm"
                  variant={isFormVisible ? "secondary" : "default"}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isFormVisible ? "Cancelar" : "Novo Produto"}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {isFormVisible && (
          <ProductForm
            onAdd={addProduct}
            onEdit={editProduct}
            productEdit={productEdit}
            onCancel={handleCloseForm}
          />
        )}

        {error && !loading && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <div className="text-center text-destructive">
                <p className="font-medium">Erro ao carregar produtos</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  className="mt-4 bg-transparent"
                >
                  Tentar novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!error && (
          <>
            <Separator />
            <ProductList
              products={products}
              onDelete={removeProduct}
              onEdit={handleEditProduct}
              loading={loading}
            />
          </>
        )}
      </div>

      <Toaster />
    </div>
  );
}
