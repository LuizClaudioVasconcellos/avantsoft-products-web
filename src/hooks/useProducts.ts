"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product } from "@/types/product";
import {
  createProduct,
  getProducts,
  deleteProduct,
  updateProduct,
} from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { get } from "http";

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  addProduct: (product: Omit<Product, "id">) => Promise<void>;
  editProduct: (id: number, product: Omit<Product, "id">) => Promise<void>;
  removeProduct: (id: number) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao carregar produtos";
      setError(errorMessage);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (newProduct: Omit<Product, "id">) => {
    try {
      const response = await createProduct(newProduct);
      if (response) {
        setProducts((prevProducts) => [...prevProducts, response]);
        toast({
          title: "Sucesso",
          description: "Produto adicionado com sucesso!",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao adicionar produto";
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    } finally {
      getProducts();
    }
  };

  const editProduct = async (
    id: number,
    updatedProduct: Omit<Product, "id">
  ) => {
    try {
      console.log("editProduct called with:", { id, updatedProduct });

      if (!id || id <= 0) {
        throw new Error("ID do produto é inválido");
      }

      const response = await updateProduct(id, updatedProduct);
      if (response) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.id === id ? response : product
          )
        );
        toast({
          title: "Sucesso",
          description: "Produto atualizado com sucesso!",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar produto";
      console.error("Error updating product:", err);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const removeProduct = async (id: number) => {
    try {
      // DELETE não retorna dados, apenas remove
      await deleteProduct(id);

      // Atualizar o estado local removendo o produto
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== id)
      );

      toast({
        title: "Sucesso",
        description: "Produto removido com sucesso!",
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao remover produto";
      console.error("Error removing product:", err);
      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const refreshProducts = async () => {
    await fetchProducts();
  };

  return {
    products,
    loading,
    error,
    addProduct,
    removeProduct,
    editProduct,
    refreshProducts,
  };
}
