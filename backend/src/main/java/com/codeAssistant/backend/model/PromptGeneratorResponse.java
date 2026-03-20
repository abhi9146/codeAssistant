package com.codeAssistant.backend.model;

/**
 * Response model for POST /api/generate-prompt
 *
 * Returns:
 *  - detectedField    : What field/domain was detected (e.g. "Web Development", "Healthcare")
 *  - detectedLanguage : Language of the input (e.g. "English", "Hindi", "Spanish")
 *  - generatedPrompt  : The clean, detailed, professional prompt
 *  - promptVariants   : 2 alternative versions of the prompt (different angles/tones)
 *  - tips             : Quick tips on how to improve or use the prompt further
 */
public class PromptGeneratorResponse {

    private String  detectedField;
    private String  detectedLanguage;
    private String  generatedPrompt;
    private String  promptVariants;
    private String  tips;
    private boolean success;
    private String  errorMessage;

    public PromptGeneratorResponse() {}

    public static PromptGeneratorResponse success(
            String detectedField,
            String detectedLanguage,
            String generatedPrompt,
            String promptVariants,
            String tips) {
        PromptGeneratorResponse r = new PromptGeneratorResponse();
        r.detectedField    = detectedField;
        r.detectedLanguage = detectedLanguage;
        r.generatedPrompt  = generatedPrompt;
        r.promptVariants   = promptVariants;
        r.tips             = tips;
        r.success          = true;
        return r;
    }

    public static PromptGeneratorResponse failure(String errorMessage) {
        PromptGeneratorResponse r = new PromptGeneratorResponse();
        r.success      = false;
        r.errorMessage = errorMessage;
        return r;
    }

    public String  getDetectedField()    { return detectedField; }
    public String  getDetectedLanguage() { return detectedLanguage; }
    public String  getGeneratedPrompt()  { return generatedPrompt; }
    public String  getPromptVariants()   { return promptVariants; }
    public String  getTips()             { return tips; }
    public boolean isSuccess()           { return success; }
    public String  getErrorMessage()     { return errorMessage; }
}