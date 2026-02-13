package com.aayush.lad.hrms.core.result;

import lombok.Getter;

@Getter
public class Result<T> {

    private final int statusCode;
    private final T data;
    private final String message;
    private final boolean success;

    public Result(int statusCode, T data, String message) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }

    // result with data
    public Result(int statusCode, T data) {
        this(statusCode, data, null);
    }

    // result with no data no message
    public Result(int statusCode) {
        this(statusCode, null, null);
    }

    // result with message
    public Result(int statusCode, String message) {
        this(statusCode, null, message);
    }
}


