import client from "./client";

function formatRelativeTime(isoString) {
  if (!isoString) return "방금 전";
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "방금 전";
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "어제" : `${days}일 전`;
}

function normalizeComment(comment) {
  return {
    id: comment.id,
    writer: comment.writerNickname,
    writerId: comment.writerNickname,
    parentCommentId: comment.parentCommentId || null,
    isSeller: Boolean(comment.isSeller ?? comment.seller),
    content: comment.content,
    rawCreatedAt: comment.createdAt,
    createdAt: formatRelativeTime(comment.createdAt),
    replies: [],
  };
}

function groupCommentThreads(comments) {
  const normalized = comments
    .map(normalizeComment)
    .sort((a, b) => new Date(a.rawCreatedAt || 0) - new Date(b.rawCreatedAt || 0));
  const threads = [];
  const threadById = new Map();

  normalized.forEach((comment) => {
    if (comment.parentCommentId) {
      const target = threadById.get(comment.parentCommentId);
      if (target) {
        target.replies.push({
          id: comment.id,
          writer: comment.writer,
          writerId: comment.writerId,
          content: comment.content,
          createdAt: comment.createdAt,
        });
      }
      return;
    }

    if (comment.isSeller && threads.length > 0) {
      const target = threads[threads.length - 1];
      target.replies.push({
        id: comment.id,
        writer: comment.writer,
        writerId: comment.writerId,
        content: comment.content,
        createdAt: comment.createdAt,
      });
      return;
    }

    const thread = { ...comment, replies: [...comment.replies] };
    threads.push(thread);
    threadById.set(comment.id, thread);
  });

  return threads.reverse();
}

export async function fetchSecretComments(productId) {
  const response = await client.get(`/api/products/${productId}/comments`);
  return groupCommentThreads(response.data.data || []);
}

export async function createSecretComment(productId, content, parentCommentId = null) {
  const response = await client.post(`/api/products/${productId}/comments`, { content, parentCommentId });
  return normalizeComment(response.data.data);
}
