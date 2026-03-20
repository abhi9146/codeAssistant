package com.codeAssistant.backend.exception;

import com.codeAssistant.backend.model.CodeAssistantResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(GeminiApiException.class)
    public ResponseEntity<CodeAssistantResponse> handleGemini(GeminiApiException ex) {
        log.error("Gemini error: {}", ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(CodeAssistantResponse.failure("AI service error: " + ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CodeAssistantResponse> handleGeneric(Exception ex) {
        log.error("Unexpected error [{}]: {}", ex.getClass().getName(), ex.getMessage(), ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(CodeAssistantResponse.failure("Error: " + ex.getMessage()));
    }
}