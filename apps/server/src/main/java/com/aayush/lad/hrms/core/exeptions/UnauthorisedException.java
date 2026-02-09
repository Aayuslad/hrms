package com.aayush.lad.hrms.core.exeptions;

public class UnauthorisedException extends RuntimeException {

    public UnauthorisedException(String message) {
        super(message);
    }

    public UnauthorisedException() {
        this("Unauthorized access");
    }
}
