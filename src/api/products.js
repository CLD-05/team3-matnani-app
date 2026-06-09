export async function createProduct(product) {
  return { ...product };
}

export async function updateProduct(productId, updates) {
  return {
    productId,
    updates: { ...updates },
  };
}

export async function deleteProduct(productId) {
  return { productId };
}
