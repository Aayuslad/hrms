package com.aayush.lad.hrms.core.exeptions;

public class NotFoundException extends DomainException {

    public NotFoundException(String message) {
        super(message);
    }

    public NotFoundException() {
        this("Resource not found");
    }
}
