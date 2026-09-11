namespace OsoCoddy.Api.Models;

public class UserProgress
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string CourseSlug { get; set; } = string.Empty;

    public int LessonId { get; set; }

    public bool Completed { get; set; } = true;

    public int XpEarned { get; set; }

    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    public User User { get; set; } = null!;
}