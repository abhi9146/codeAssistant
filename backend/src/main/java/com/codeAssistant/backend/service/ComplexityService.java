package com.codeAssistant.backend.service;

import com.codeAssistant.backend.exception.GeminiApiException;
import com.codeAssistant.backend.model.ComplexityResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Standalone service for Big-O complexity analysis.
 * Uses the same Gemini API key but with a completely different prompt
 * designed specifically to extract structured complexity information.
 *
 * WHY A SEPARATE SERVICE (not reusing GeminiApiService):
 * - Different prompt structure
 * - Different response parsing (extracts specific fields)
 * - Different response model
 * - Keeps both features independently maintainable
 */
@Service
public class ComplexityService {

    private static final Logger log = LoggerFactory.getLogger(ComplexityService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    private final RestTemplate restTemplate;

    public ComplexityService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public ComplexityResponse analyze(String code) {
        log.info("Running complexity analysis. Code length: {} chars", code.length());

        String rawResponse = callGemini(code);
        log.debug("Raw Gemini response: {}", rawResponse);

        return parseComplexityResponse(rawResponse);
    }

    /**
     * Sends a structured prompt to Gemini asking for a very specific
     * response format with labeled fields that are easy to parse.
     *
     * WHY THIS PROMPT DESIGN:
     * We instruct Gemini to respond with labeled markers like:
     *   TIME_COMPLEXITY: O(n²)
     *   SPACE_COMPLEXITY: O(1)
     *
     * This makes parsing reliable using regex — much more robust than
     * asking Gemini for JSON (which often adds markdown fences around it)
     * or free-form text (which is unpredictable to parse).
     */
    private String callGemini(String code) {
        String url = GEMINI_URL + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String prompt = buildPrompt(code);

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            )
        );

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            return extractRawText(response.getBody());
        } catch (HttpClientErrorException e) {
            log.error("Gemini 4xx: {}", e.getResponseBodyAsString());
            throw new GeminiApiException("Gemini error: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Gemini call failed: {}", e.getMessage(), e);
            throw new GeminiApiException("Could not reach Gemini: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(String code) {
        return """
            You are an expert algorithm analyst. Analyze the time and space complexity of the code below.
            
            Respond using EXACTLY this format with these exact labels (do not change the labels):
            
            TIME_COMPLEXITY: <e.g. O(n²)>
            SPACE_COMPLEXITY: <e.g. O(1)>
            OPTIMIZED_COMPLEXITY: <Big-O of an optimized version, e.g. O(n log n)>
            EXPLANATION: <One sentence explaining why the time complexity is what it is>
            
            DETAILS:
            <Provide a detailed markdown breakdown covering:
            - Loop analysis (how many nested loops, what they iterate over)
            - Recursive calls (if any, include recurrence relation)
            - Data structure operations (sorting, hashing, etc.)
            - Best case / worst case / average case if they differ
            - How to achieve the OPTIMIZED_COMPLEXITY>
            
            Code to analyze:
            ```
            %s
            ```
            """.formatted(code);
    }

    /**
     * Parses Gemini's labeled response into structured fields.
     *
     * Uses regex to find each labeled field:
     *   TIME_COMPLEXITY: O(n²)  →  timeComplexity = "O(n²)"
     *   SPACE_COMPLEXITY: O(1)  →  spaceComplexity = "O(1)"
     *
     * Everything after "DETAILS:" is treated as the full markdown analysis.
     *
     * Fallback: if a label is not found, returns "N/A" for that field
     * rather than throwing an exception.
     */
    private ComplexityResponse parseComplexityResponse(String raw) {
        String timeComplexity      = extractLabel(raw, "TIME_COMPLEXITY");
        String spaceComplexity     = extractLabel(raw, "SPACE_COMPLEXITY");
        String optimizedComplexity = extractLabel(raw, "OPTIMIZED_COMPLEXITY");
        String explanation         = extractLabel(raw, "EXPLANATION");
        String details             = extractDetails(raw);

        log.info("Parsed → Time: {}, Space: {}, Optimized: {}",
                 timeComplexity, spaceComplexity, optimizedComplexity);

        return ComplexityResponse.success(
            timeComplexity,
            spaceComplexity,
            explanation,
            optimizedComplexity,
            details
        );
    }

    /** Extracts value after "LABEL: " on the same line */
    private String extractLabel(String text, String label) {
        Pattern pattern = Pattern.compile(label + ":\\s*(.+)");
        Matcher matcher = pattern.matcher(text);
        return matcher.find() ? matcher.group(1).trim() : "N/A";
    }

    /** Extracts everything after the "DETAILS:" marker */
    private String extractDetails(String text) {
        int index = text.indexOf("DETAILS:");
        if (index == -1) return text; // fallback: return whole response
        return text.substring(index + "DETAILS:".length()).trim();
    }

    /** Navigate Gemini's nested JSON to get the text content */
    @SuppressWarnings("unchecked")
    private String extractRawText(Map<?, ?> responseBody) {
        try {
            var candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            var content    = (Map<String, Object>) candidates.get(0).get("content");
            var parts      = (List<Map<String, Object>>) content.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            throw new GeminiApiException("Failed to parse Gemini response: " + e.getMessage());
        }
    }
}