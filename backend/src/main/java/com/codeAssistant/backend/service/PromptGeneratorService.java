package com.codeAssistant.backend.service;

import com.codeAssistant.backend.exception.GeminiApiException;
import com.codeAssistant.backend.model.PromptGeneratorResponse;

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
 * Service that takes any vague user input (any language, any field)
 * and uses Gemini to generate a clear, professional, detailed prompt.
 *
 * WHAT MAKES THIS UNIQUE:
 * - No language barrier: works with English, Hindi, Spanish, etc.
 * - No field restriction: coding, healthcare, marketing, legal, education, etc.
 * - Returns 3 things: main prompt + 2 variants + tips
 * - Detects the field and language automatically
 */
@Service
public class PromptGeneratorService {

    private static final Logger log = LoggerFactory.getLogger(PromptGeneratorService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final String GEMINI_URL =
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    private final RestTemplate restTemplate;

    public PromptGeneratorService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PromptGeneratorResponse generate(String userInput) {
        log.info("Generating prompt for input: '{}'", userInput);
        String rawResponse = callGemini(userInput);
        return parseResponse(rawResponse);
    }

    /**
     * WHY THIS PROMPT DESIGN:
     *
     * 1. "You are a world-class prompt engineer" → sets expert persona
     *    so Gemini produces professional-grade prompts, not generic ones.
     *
     * 2. "Detect the language and field automatically" → makes it universal,
     *    no need for the user to specify what domain they're in.
     *
     * 3. Labeled response format (DETECTED_FIELD:, GENERATED_PROMPT: etc.)
     *    → makes parsing reliable with regex, same proven approach as
     *    ComplexityService.
     *
     * 4. "2 variant prompts" → gives users options and teaches them
     *    how different framings produce different results.
     *
     * 5. "Always respond in English regardless of input language" →
     *    ensures the generated prompt is usable universally, even if
     *    the user typed in Hindi or Spanish.
     */
    private String callGemini(String userInput) {
        String url = GEMINI_URL + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String prompt = buildMetaPrompt(userInput);

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
            log.error("Gemini error: {}", e.getResponseBodyAsString());
            throw new GeminiApiException("Gemini error: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("Failed to call Gemini: {}", e.getMessage(), e);
            throw new GeminiApiException("Could not reach Gemini: " + e.getMessage(), e);
        }
    }

    private String buildMetaPrompt(String userInput) {
        return """
            You are a world-class prompt engineer who specializes in transforming vague,
            unclear, or incomplete ideas into clear, detailed, professional AI prompts.
            
            The user will give you a rough idea — it could be in ANY language (English,
            Hindi, Spanish, French, etc.) and about ANY field (technology, healthcare,
            education, marketing, legal, finance, cooking, art, etc.).
            
            Your job:
            1. Detect the language and field automatically
            2. Transform their vague idea into a powerful, specific, professional prompt
            3. Provide 2 alternative prompt variants (different angles or tones)
            4. Give 2-3 tips to make the prompt even better
            
            ALWAYS respond using EXACTLY these labels (respond in English):
            
            DETECTED_FIELD: <detected domain, e.g. "Web Development", "Healthcare", "Marketing">
            DETECTED_LANGUAGE: <language of user input, e.g. "English", "Hindi", "Spanish">
            
            GENERATED_PROMPT:
            <Write the main generated prompt here — make it detailed, specific, professional.
            Include: role/persona, context, specific requirements, expected output format,
            constraints. Minimum 3-4 sentences.>
            
            PROMPT_VARIANTS:
            Variant 1 — <label, e.g. "Concise Version">:
            <shorter, more direct version of the prompt>
            
            Variant 2 — <label, e.g. "Strict/Expert Version">:
            <more demanding, expert-level version>
            
            TIPS:
            <2-3 bullet points on how to further improve or customize this prompt>
            
            User's vague input: "%s"
            """.formatted(userInput);
    }

    /**
     * Parses labeled response into structured fields.
     * Uses regex for single-line fields and index-based extraction
     * for multi-line blocks (GENERATED_PROMPT, PROMPT_VARIANTS, TIPS).
     */
    private PromptGeneratorResponse parseResponse(String raw) {
        String detectedField    = extractLabel(raw, "DETECTED_FIELD");
        String detectedLanguage = extractLabel(raw, "DETECTED_LANGUAGE");
        String generatedPrompt  = extractBlock(raw, "GENERATED_PROMPT:", "PROMPT_VARIANTS:");
        String promptVariants   = extractBlock(raw, "PROMPT_VARIANTS:", "TIPS:");
        String tips             = extractAfter(raw, "TIPS:");

        log.info("Parsed → Field: {}, Language: {}", detectedField, detectedLanguage);

        return PromptGeneratorResponse.success(
            detectedField, detectedLanguage,
            generatedPrompt, promptVariants, tips
        );
    }

    /** Extracts single-line labeled value */
    private String extractLabel(String text, String label) {
        Pattern p = Pattern.compile(label + ":\\s*(.+)");
        Matcher m = p.matcher(text);
        return m.find() ? m.group(1).trim() : "Unknown";
    }

    /** Extracts text block between two markers */
    private String extractBlock(String text, String startMarker, String endMarker) {
        int start = text.indexOf(startMarker);
        int end   = text.indexOf(endMarker);
        if (start == -1) return "";
        start += startMarker.length();
        if (end == -1 || end < start) return text.substring(start).trim();
        return text.substring(start, end).trim();
    }

    /** Extracts everything after a marker */
    private String extractAfter(String text, String marker) {
        int index = text.lastIndexOf(marker);
        if (index == -1) return "";
        return text.substring(index + marker.length()).trim();
    }

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