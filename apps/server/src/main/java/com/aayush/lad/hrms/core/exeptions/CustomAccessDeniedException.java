package com.aayush.lad.hrms.core.exeptions;

public class CustomAccessDeniedException extends DomainException {
    public CustomAccessDeniedException(String message) {
        super(message);
    }

    public CustomAccessDeniedException() {
        this("Access Denied");
    }
}
