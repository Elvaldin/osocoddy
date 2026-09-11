namespace OsoCoddy.Api.DTOs.Challenges;

public record CheckChallengeRequest(
    string CourseSlug,
    int LessonId,
    string Code
);