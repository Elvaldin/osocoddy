namespace OsoCoddy.Api.DTOs.Progress;

public record CompleteLessonRequest(
    string CourseSlug,
    int LessonId,
    string? ChallengeProof
);