package com.codeAssistant.backend.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.codeAssistant.backend.model.PromptGeneratorRequest;
import com.codeAssistant.backend.model.PromptGeneratorResponse;
import com.codeAssistant.backend.service.PromptGeneratorService;

/**
 * REST Controller for the universal Prompt Generator.
 *
 * Endpoint: POST /api/generate-prompt
 *
 * Completely standalone — no dependency on any other feature.
 *
 * EXAMPLE REQUEST:
 *   POST http://localhost:8080/api/generate-prompt
 *   { "userInput": "make website fast" }
 *
 * EXAMPLE RESPONSE:
 *   {
 *     "detectedField":    "Web Development",
 *     "detectedLanguage": "English",
 *     "generatedPrompt":  "Act as a senior web performance engineer...",
 *     "promptVariants":   "Variant 1 — Concise: ...\nVariant 2 — Expert: ...",
 *     "tips":             "• Specify the tech stack...",
 *     "success":          true
 *   }
 */
@RestController
@RequestMapping("/api")
public class PromptGeneratorController {

    private static final Logger log = LoggerFactory.getLogger(PromptGeneratorController.class);

    private final PromptGeneratorService promptGeneratorService;

    public PromptGeneratorController(PromptGeneratorService promptGeneratorService) {
        this.promptGeneratorService = promptGeneratorService;
    }

    @PostMapping("/generate-prompt")
    public ResponseEntity<PromptGeneratorResponse> generate(
            @RequestBody PromptGeneratorRequest request) {

        if (request.getUserInput() == null || request.getUserInput().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(PromptGeneratorResponse.failure("Input must not be blank"));
        }

        log.info("Prompt generation requested: '{}'", request.getUserInput());
        PromptGeneratorResponse response = promptGeneratorService.generate(request.getUserInput());
        return ResponseEntity.ok(response);
    }
}