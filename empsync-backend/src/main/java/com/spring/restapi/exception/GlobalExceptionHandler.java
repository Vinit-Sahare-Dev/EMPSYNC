package com.spring.restapi.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(EmployeeNotFoundException.class)
    public ResponseEntity<APIErrorResponse> handleNotFound(EmployeeNotFoundException ex) {
        logger.warn("🔍 Employee not found: {}", ex.getMessage());
        APIErrorResponse apiError = createErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiError);
    }

    @ExceptionHandler(IllegalDepartmentException.class)
    public ResponseEntity<APIErrorResponse> handleIllegalDept(IllegalDepartmentException ex) {
        logger.warn("🏢 Invalid department: {}", ex.getMessage());
        APIErrorResponse apiError = createErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<APIErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> validationErrors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            validationErrors.put(error.getField(), error.getDefaultMessage());
        }
        logger.warn("❌ Validation failed: {}", validationErrors);
        
        APIErrorResponse apiError = createErrorResponse(HttpStatus.BAD_REQUEST, "Validation failed: " + validationErrors);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<APIErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        logger.warn("⚙️ Type mismatch: {}", ex.getMessage());
        APIErrorResponse apiError = createErrorResponse(HttpStatus.BAD_REQUEST, "Invalid parameter type: " + ex.getName());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<APIErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        logger.warn("🚫 Illegal argument: {}", ex.getMessage());
        APIErrorResponse apiError = createErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIErrorResponse> handleGeneralException(Exception ex) {
        logger.error("🚨 Unhandled exception: ", ex);
        APIErrorResponse apiError = createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred: " + ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiError);
    }

    private APIErrorResponse createErrorResponse(HttpStatus status, String message) {
        APIErrorResponse apiError = new APIErrorResponse();
        apiError.setStatusCode(status.value());
        apiError.setMessage(message);
        apiError.setDateTime(LocalDateTime.now());
        return apiError;
    }
}
