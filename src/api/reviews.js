export async function createReview(review) {
  return { ...review };
}

export async function updateReview(reviewId, updates) {
  return {
    reviewId,
    updates: { ...updates },
  };
}

export async function deleteReview(reviewId) {
  return { reviewId };
}
