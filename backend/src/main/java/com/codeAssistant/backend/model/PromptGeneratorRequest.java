package com.codeAssistant.backend.model;

/**
 * Request model for POST /api/generate-prompt
 *
 * Takes any vague, unclear, or partial user input in any language
 * and returns a clear, professional, field-specific prompt.
 *
 */
public class PromptGeneratorRequest {
    private String userInput;  // Raw vague input from user — any language, any field

    public PromptGeneratorRequest() {}
    public String getUserInput() { return userInput; }
    public void setUserInput(String userInput) { this.userInput = userInput; }
}