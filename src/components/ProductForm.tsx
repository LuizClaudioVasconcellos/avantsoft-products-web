"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, X, Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types/product";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  price: z.number().min(0.01, "Preço deve ser maior que zero"),
  sku: z.string().min(1, "SKU é obrigatório").max(50, "SKU muito longo"),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  onAdd: (product: Omit<Product, "id">) => Promise<void>;
  onEdit: (id: number, product: Omit<Product, "id">) => Promise<void>;
  productEdit: Product | null;
  onCancel: () => void;
}

export default function ProductForm({
  onAdd,
  onEdit,
  onCancel,
  productEdit,
}: ProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!productEdit;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: 0,
      sku: "",
    },
  });

  // Atualiza o formulário quando productEdit muda
  useEffect(() => {
    if (productEdit) {
      form.reset({
        name: productEdit.name,
        price: Number(productEdit.price), // Garantir que seja number
        sku: productEdit.sku,
      });
    } else {
      form.reset({
        name: "",
        price: 0,
        sku: "",
      });
    }
  }, [productEdit, form]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);

      // Garantir que o price seja number
      const formattedData = {
        ...data,
        price: Number(data.price),
      };

      if (isEditing && productEdit) {
        await onEdit(productEdit.id, formattedData);
      } else {
        await onAdd(formattedData);
      }

      form.reset();
      onCancel();
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="animate-fadeIn">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl">
            {isEditing ? "Editar Produto" : "Adicionar Produto"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Altere os dados do produto"
              : "Preencha os dados do novo produto"}
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Digite o nome do produto"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          // Converte para number, ou 0 se vazio/inválido
                          const numericValue =
                            value === "" ? 0 : Number.parseFloat(value);
                          field.onChange(
                            isNaN(numericValue) ? 0 : numericValue
                          );
                        }}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Digite o SKU"
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isEditing ? (
                  <Edit className="w-4 h-4 mr-2" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                {isSubmitting
                  ? isEditing
                    ? "Salvando..."
                    : "Adicionando..."
                  : isEditing
                  ? "Salvar Alterações"
                  : "Adicionar Produto"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
