namespace OsoCoddy.Api.Models;

public class User
{
    public int Id { get; set; }

    public string Username { get; set; } =
        string.Empty;

    public string Email { get; set; } =
        string.Empty;

    public string PasswordHash { get; set; } =
        string.Empty;

    public int Xp { get; set; } = 0;


    // 🔥 Racha actual
    public int CurrentStreak { get; set; } = 0;


    // 🏆 Mejor racha histórica
    public int LongestStreak { get; set; } = 0;


    // 📅 Último día en el que completó una lección
    public DateTime? LastActivityDate { get; set; }


    public DateTime CreatedAt { get; set; } =
        DateTime.UtcNow;


    public List<UserProgress> Progress { get; set; } =
        new();

    public List<UserAchievement> Achievements { get; set; } =
        new();
}