package com.codeAssistant.backend.model;

/**
 * Request model for POST /api/complexity
 * Completely separate from CodeAssistantRequest — no shared coupling.
 */
public class ComplexityRequest {
    private String code;

    public ComplexityRequest() {}
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}