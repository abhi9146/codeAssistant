package com.codeAssistant.backend.model;

/**
 * Response model for POST /api/complexity
 *
 * Returns structured Big-O analysis with separate fields for:
 * - timeComplexity   : e.g. "O(n²)"
 * - spaceComplexity  : e.g. "O(1)"
 * - explanation      : human-readable breakdown of why
 * - optimizedVersion : Big-O of the suggested optimized code
 * - details          : full markdown analysis (loops, recursion, etc.)
 */
public class ComplexityResponse {

    private String  timeComplexity;
    private String  spaceComplexity;
    private String  explanation;
    private String  optimizedComplexity;
    private String  details;
    private boolean success;
    private String  errorMessage;

    public ComplexityResponse() {}

    public static ComplexityResponse success(
            String timeComplexity,
            String spaceComplexity,
            String explanation,
            String optimizedComplexity,
            String details) {
        ComplexityResponse r = new ComplexityResponse();
        r.timeComplexity      = timeComplexity;
        r.spaceComplexity     = spaceComplexity;
        r.explanation         = explanation;
        r.optimizedComplexity = optimizedComplexity;
        r.details             = details;
        r.success             = true;
        return r;
    }

    public static ComplexityResponse failure(String errorMessage) {
        ComplexityResponse r = new ComplexityResponse();
        r.success      = false;
        r.errorMessage = errorMessage;
        return r;
    }

    // Getters
    public String  getTimeComplexity()      { return timeComplexity; }
    public String  getSpaceComplexity()     { return spaceComplexity; }
    public String  getExplanation()         { return explanation; }
    public String  getOptimizedComplexity() { return optimizedComplexity; }
    public String  getDetails()             { return details; }
    public boolean isSuccess()              { return success; }
    public String  getErrorMessage()        { return errorMessage; }
}
