package com.codeAssistant.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.codeAssistant.backend.model.ComplexityRequest;
import com.codeAssistant.backend.model.ComplexityResponse;
import com.codeAssistant.backend.service.ComplexityService;

/**
 * Standalone REST controller for Big-O complexity analysis.
 *
 * Endpoint: POST /api/complexity
 *
 * Completely independent from CodeAssistantController.
 * No shared state, no shared service — just a new feature
 * that happens to use the same Gemini API key.
 *
 * EXAMPLE REQUEST:
 *   POST http://localhost:8080/api/complexity
 *   Content-Type: application/json
 *   { "code": "for(int i=0; i<n; i++) for(int j=0; j<n; j++) sum++;" }
 *
 * EXAMPLE RESPONSE:
 *   {
 *     "timeComplexity":      "O(n²)",
 *     "spaceComplexity":     "O(1)",
 *     "explanation":         "Two nested loops each running n times",
 *     "optimizedComplexity": "O(n)",
 *     "details":             "## Loop Analysis\n...",
 *     "success":             true
 *   }
 */
@RestController
@RequestMapping("/api")
public class ComplexityController {

    private static final Logger log = LoggerFactory.getLogger(ComplexityController.class);

    private final ComplexityService complexityService;

    public ComplexityController(ComplexityService complexityService) {
        this.complexityService = complexityService;
    }

    @PostMapping("/complexity")
    public ResponseEntity<ComplexityResponse> analyze(@RequestBody ComplexityRequest request) {
        if (request.getCode() == null || request.getCode().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(ComplexityResponse.failure("Code must not be blank"));
        }

        log.info("Complexity analysis requested. Code length: {}", request.getCode().length());
        ComplexityResponse response = complexityService.analyze(request.getCode());
        return ResponseEntity.ok(response);
    }
}