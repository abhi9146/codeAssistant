package com.codeAssistant.backend.model;

public class CodeAssistantResponse {
    private String review;
    private boolean success;
    private String errorMessage;

    public CodeAssistantResponse() {}

    public static CodeAssistantResponse success(String review) {
        CodeAssistantResponse r = new CodeAssistantResponse();
        r.review = review;
        r.success = true;
        return r;
    }

    public static CodeAssistantResponse failure(String errorMessage) {
        CodeAssistantResponse r = new CodeAssistantResponse();
        r.success = false;
        r.errorMessage = errorMessage;
        return r;
    }

    public String getReview() { return review; }
    public boolean isSuccess() { return success; }
    public String getErrorMessage() { return errorMessage; }
}