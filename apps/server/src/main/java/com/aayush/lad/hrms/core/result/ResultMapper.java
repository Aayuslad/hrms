package com.aayush.lad.hrms.core.result;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public final class ResultMapper {

    private ResultMapper() {}

    // Sucess with data
    public static <T> ResponseEntity<Result<T>> handle(HttpStatus status, T data) {
        Result<T> response = new Result<>(status.value(), data);
        return new ResponseEntity<>(response, status);
    }

    // Sucess without data
    public static ResponseEntity<Result<Void>> handle(HttpStatus status) {
        Result<Void> response = new Result<>(status.value());
        return new ResponseEntity<>(response, status);
    }

    // Failure
    public static ResponseEntity<Result<Void>> handle(HttpStatus status, String message) {
        Result<Void> response = new Result<>(status.value(), message);
        return new ResponseEntity<>(response, status);
    }
}

