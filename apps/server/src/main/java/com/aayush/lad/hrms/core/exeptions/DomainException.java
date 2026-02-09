package com.aayush.lad.hrms.core.exeptions;


public class DomainException extends RuntimeException {

    public DomainException(String message) {
        super(message);
    }

    public DomainException() {
        this("A domain error occurred");
    }
}