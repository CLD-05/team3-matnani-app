package com.example.matnani.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RedissonConfig {

    @Value("${spring.data.redis.host:localhost}")
    private String host;

    @Value("${spring.data.redis.port:6379}")
    private int port;

    @Bean(destroyMethod = "shutdown")
    public RedissonClient redissonClient() {
        Config config = new Config();
        config.useSingleServer()
                .setAddress("redis://" + host + ":" + port)
                // [수정] 커넥션 풀 설정 추가
                // 기존: 기본값(connectionPoolSize=64, minimumIdleSize=24)
                //       → 부하 시 Redis 연결 수가 38개까지 급증하며 경합 발생
                // 변경: dev Redis 제한(10개)에 맞춰 풀 크기 조정
                //       → 불필요한 커넥션 경합 제거, 안정적인 연결 관리
                .setConnectionPoolSize(10)
                .setConnectionMinimumIdleSize(5);
        return Redisson.create(config);
    }
}