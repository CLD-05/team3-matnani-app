import axios from "axios";
import client from "./client";

// 파일 → S3 업로드 후 imageUrl 반환
export async function uploadImage(file) {
  // 1. 백엔드에서 presigned URL 발급
  const { data } = await client.post("/api/images/presigned-url", {
    filename: file.name,
    contentType: file.type,
  });

  const { presignedUrl, imageUrl } = data.data;

  // 2. S3에 직접 업로드 (인증 토큰 불필요)
  await axios.put(presignedUrl, file, {
    headers: { "Content-Type": file.type },
  });

  return imageUrl;
}

// 여러 파일 동시 업로드
export async function uploadImages(files) {
  return Promise.all(files.map((file) => uploadImage(file)));
}
