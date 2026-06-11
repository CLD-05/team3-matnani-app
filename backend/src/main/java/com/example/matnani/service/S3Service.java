package com.example.matnani.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PresignedPutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import java.time.Duration;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3Service {

    private final S3Presigner s3Presigner;

    @Value("${cloud.aws.s3.bucket}")
    private String bucket;

    @Value("${cloud.aws.s3.cdn-url:}")
    private String cdnUrl;

    // filename, contentType 받아서 presignedUrl + imageUrl 같이 반환
    public Map<String, String> generatePresignedUrl(String filename, String contentType) {
        String extension = filename.contains(".")
                ? filename.substring(filename.lastIndexOf(".") + 1)
                : "jpg";
        String key = "products/" + UUID.randomUUID() + "." + extension;

        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .putObjectRequest(putRequest)
                .build();

        PresignedPutObjectRequest presigned = s3Presigner.presignPutObject(presignRequest);
        String presignedUrl = presigned.url().toString();

        // CDN URL 없으면 S3 URL 그대로 사용
        String imageUrl = cdnUrl.isEmpty()
                ? "https://" + bucket + ".s3.amazonaws.com/" + key
                : cdnUrl + "/" + key;

        return Map.of(
                "presignedUrl", presignedUrl,
                "imageUrl", imageUrl
        );
    }
}