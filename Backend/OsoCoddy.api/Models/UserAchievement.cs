namespace OsoCoddy.Api.Models;

public class UserAchievement
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string AchievementCode { get; set; } =
        string.Empty;

    public DateTime UnlockedAt { get; set; } =
        DateTime.UtcNow;

    public User User { get; set; } = null!;
}