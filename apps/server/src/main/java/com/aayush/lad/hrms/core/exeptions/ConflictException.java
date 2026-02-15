package com.aayush.lad.hrms.core.exeptions;

public class ConflictException extends DomainException {

    public ConflictException(String message) {
        super(message);
    }

    public ConflictException() {
        this("Conflict occurred");
    }
}