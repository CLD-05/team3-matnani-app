package com.example.matnani.domain.enums;

public class Enums {

    public enum RegionType {
        CITY, DISTRICT, DONG
    }

    public enum UserRole {
        NORMAL, BUSINESS
    }

    public enum ProductCategory {
        BAKERY_DESSERT, PRODUCE_SEAFOOD, PROCESSED_FOOD, ETC
    }

    public enum DefectReason {
        SHAPE_BAD, NEAR_EXPIRY, SCRATCH, ETC
    }

    public enum ProductStatus {
        ON_SALE, RESERVED, SOLD_OUT, EXPIRED
    }

    public enum VerifyStatus {
        PENDING, VERIFIED, REJECTED
    }

    public enum ReservationStatus {
        REQUESTED, ACCEPTED, CANCELED, COMPLETED, NO_SHOW
    }

    public enum NotificationType {
        COMMENT, RESERVATION, STATUS_CHANGE, PICKUP_REMINDER, PICKUP_REMINDER_30, PICKUP_REMINDER_10, NO_SHOW
    }
}
