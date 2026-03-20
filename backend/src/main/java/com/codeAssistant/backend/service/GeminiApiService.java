package com.codeAssistant.backend.service;

import com.codeAssistant.backend.exception.GeminiApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class GeminiApiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiApiService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    public GeminiApiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String reviewCode(String userCode) {
        log.info("Calling Gemini. Code length: {} chars", userCode.length());
        log.info("API key starts with: {}", apiKey.substring(0, Math.min(8, apiKey.length())));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        // API key passed as query param — standard for Gemini native API
        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + apiKey;
                 
        /*
         * Native Gemini request body format:
         * {
         *   "contents": [{ "parts": [{ "text": "..." }] }]
         * }
         */
        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", buildPrompt(userCode))
                ))
            )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            log.info("Calling URL: {}", url.replace(apiKey, "***"));
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            log.info("Response status: {}", response.getStatusCode());
            return extractText(response.getBody());

        } catch (HttpClientErrorException e) {
            log.error("4xx Error: {} Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new GeminiApiException("Gemini error (" + e.getStatusCode() + "): " + e.getResponseBodyAsString());
        } catch (HttpServerErrorException e) {
            log.error("5xx Error: {} Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new GeminiApiException("Gemini server error: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Error: {}", e.getMessage(), e);
            throw new GeminiApiException("Could not reach Gemini: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(String userCode) {
        return """
                Act as a senior software engineer doing a professional code review.
                
                Analyze the code below and respond with exactly three sections:
                
                ## 1. Bugs & Issues
                List any bugs, logical errors, null/edge case risks, or incorrect behavior.
                
                ## 2. Performance Improvements
                Suggest specific improvements for time complexity, memory, database calls, etc.
                
                ## 3. Clean & Optimized Code
                Provide a fully refactored version using best practices. Use a markdown code block.
                
                Keep each section concise and actionable. No filler text.
                
                Code to review:
                ```
                %s
                ```
                """.formatted(userCode);
    }

    /**
     * Native Gemini response format:
     * {
     *   "candidates": [{
     *     "content": {
     *       "parts": [{ "text": "## 1. Bugs..." }]
     *     }
     *   }]
     * }
     */
    @SuppressWarnings("unchecked")
    private String extractText(Map<?, ?> responseBody) {
        try {
            log.debug("Response keys: {}", responseBody.keySet());
            var candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                log.error("No candidates in response. Full body: {}", responseBody);
                throw new GeminiApiException("No candidates in response: " + responseBody);
            }
            var content = (Map<String, Object>) candidates.get(0).get("content");
            var parts   = (List<Map<String, Object>>) content.get("parts");
            String text = (String) parts.get(0).get("text");
            log.info("Successfully extracted {} chars", text.length());
            return text;
        } catch (GeminiApiException e) {
            throw e;
        } catch (Exception e) {
            log.error("Parse error: {}. Body: {}", e.getMessage(), responseBody);
            throw new GeminiApiException("Failed to parse response: " + e.getMessage());
        }
    }
}