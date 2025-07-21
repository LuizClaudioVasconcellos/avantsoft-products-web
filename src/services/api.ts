import type { Product } from "@/types/product";

const API_URL = process.env.API_URL || "http://localhost:3000/products";

async function handleResponse(response: Response) {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erro na requisição");
  }

  const contentType = response.headers.get("content-type");
  const hasJsonContent =
    contentType && contentType.includes("application/json");

  if (!hasJsonContent || response.status === 204) {
    return null;
  }

  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    return null;
  }
}

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(API_URL, {
    headers: {
      Accept: "application/json",
    },
  });
  return handleResponse(response);
};

export const createProduct = async (
  product: Omit<Product, "id">
): Promise<Product> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
    credentials: "include",
  });
  return handleResponse(response);
};

export const updateProduct = async (
  id: number,
  product: Omit<Product, "id">
): Promise<Product> => {
  console.log("Updating product with ID:", id);
  console.log("Product data:", product);

  if (!id || id <= 0) {
    throw new Error("ID do produto é obrigatório para atualização");
  }

  const url = `${API_URL}/${id}`;
  console.log("PUT URL:", url);

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
    credentials: "include",
  });

  return handleResponse(response);
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let errorMessage = "Erro ao deletar produto";
    try {
      const error = await response.json();
      errorMessage = error.message || errorMessage;
    } catch {
      errorMessage = "Erro ao deletar produto";
    }
    throw new Error(errorMessage);
  }

  return;
};
