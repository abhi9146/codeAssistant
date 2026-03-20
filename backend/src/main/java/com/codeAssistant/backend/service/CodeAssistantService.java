package com.codeAssistant.backend.service;

import com.codeAssistant.backend.model.CodeAssistantRequest;
import com.codeAssistant.backend.model.CodeAssistantResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CodeAssistantService {

    private static final Logger log = LoggerFactory.getLogger(CodeAssistantService.class);
    private final GeminiApiService geminiApiService;

    public CodeAssistantService(GeminiApiService geminiApiService) {
        this.geminiApiService = geminiApiService;
    }

    public CodeAssistantResponse performReview(CodeAssistantRequest request) {
        log.info("Performing review for code of length: {}", request.getCode().length());
        String reviewText = geminiApiService.reviewCode(request.getCode());
        return CodeAssistantResponse.success(reviewText);
    }
}