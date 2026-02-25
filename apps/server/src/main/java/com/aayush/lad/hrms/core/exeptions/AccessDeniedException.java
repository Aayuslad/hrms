package com.aayush.lad.hrms.core.exeptions;

public class AccessDeniedException extends DomainException {
    public AccessDeniedException(String message) {
        super(message);
    }

    public AccessDeniedException() {
        this("Access Denied");
    }
}
