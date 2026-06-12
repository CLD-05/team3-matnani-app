package com.example.matnani.dto.response;

import com.example.matnani.domain.entity.User;
import static com.example.matnani.domain.enums.Enums.*;
import lombok.Getter;

@Getter
public class UserResponse {
    private Long id;
    private String email;
    private String nickname;
    private String phone;
    private UserRole role;
    private String regionName;

    public static UserResponse from(User user) {
        UserResponse res = new UserResponse();
        res.id = user.getId();
        res.email = user.getEmail();
        res.nickname = user.getNickname();
        res.phone = user.getPhone();
        res.role = user.getRole();
        res.regionName = user.getRegion() != null ? user.getRegion().getName() : null;
        return res;
    }
}