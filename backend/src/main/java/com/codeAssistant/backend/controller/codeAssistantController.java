package com.codeAssistant.backend.controller;

import com.codeAssistant.backend.model.CodeAssistantRequest;
import com.codeAssistant.backend.model.CodeAssistantResponse;
import com.codeAssistant.backend.service.CodeAssistantService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class codeAssistantController {

    private final CodeAssistantService codeAssistantService;

    public codeAssistantController(CodeAssistantService codeAssistantService) {
        this.codeAssistantService = codeAssistantService;
    }

    @PostMapping("/review")
    public ResponseEntity<CodeAssistantResponse> review(@RequestBody CodeAssistantRequest request) {
        if (request.getCode() == null || request.getCode().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(CodeAssistantResponse.failure("Code must not be blank"));
        }
        return ResponseEntity.ok(codeAssistantService.performReview(request));
    }
}