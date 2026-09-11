using Microsoft.EntityFrameworkCore;

using OsoCoddy.Api.Data;
using OsoCoddy.Api.Models;

namespace OsoCoddy.Api.Services;

public record UnlockedAchievement(
    string Code,
    string Title,
    string Description,
    string Icon
);

public class AchievementService
{
    private readonly AppDbContext _db;

    public AchievementService(
        AppDbContext db
    )
    {
        _db = db;
    }


    public async Task<List<UnlockedAchievement>>
        CheckAndUnlockAsync(
            User user
        )
    {
        /*
         * Logros que el usuario
         * ya tiene.
         */
        var existingCodes =
            await _db.UserAchievements
                .Where(
                    achievement =>
                        achievement.UserId ==
                        user.Id
                )
                .Select(
                    achievement =>
                        achievement.AchievementCode
                )
                .ToListAsync();

        var existingSet =
            existingCodes.ToHashSet();


        /*
         * Cantidad total de
         * lecciones completadas.
         */
        var completedLessons =
            await _db.UserProgress
                .CountAsync(
                    progress =>
                        progress.UserId ==
                            user.Id &&
                        progress.Completed
                );


        /*
         * Lecciones de Python
         * completadas.
         */
        var pythonCompleted =
            await _db.UserProgress
                .CountAsync(
                    progress =>
                        progress.UserId ==
                            user.Id &&
                        progress.Completed &&
                        progress.CourseSlug ==
                            "python"
                );


        var candidates =
            new List<UnlockedAchievement>();


        /*
         * 🏅 PRIMER PASO
         */
        if (completedLessons >= 1)
        {
            candidates.Add(
                new UnlockedAchievement(
                    Code: "FIRST_LESSON",
                    Title: "Primer paso",
                    Description:
                        "Completa tu primera lección.",
                    Icon: "🏅"
                )
            );
        }


        /*
         * 🔥 RACHA DE 3 DÍAS
         */
        if (user.CurrentStreak >= 3)
        {
            candidates.Add(
                new UnlockedAchievement(
                    Code: "STREAK_3",
                    Title: "En llamas",
                    Description:
                        "Mantén una racha de 3 días.",
                    Icon: "🔥"
                )
            );
        }


        /*
         * 🐍 5 LECCIONES DE PYTHON
         */
        if (pythonCompleted >= 5)
        {
            candidates.Add(
                new UnlockedAchievement(
                    Code: "PYTHON_5",
                    Title: "Aprendiz de Python",
                    Description:
                        "Completa 5 lecciones de Python.",
                    Icon: "🐍"
                )
            );
        }


        /*
         * 🎓 CURSO DE PYTHON
         */
        if (pythonCompleted >= 12)
        {
            candidates.Add(
                new UnlockedAchievement(
                    Code: "PYTHON_MASTER",
                    Title: "Maestro Python",
                    Description:
                        "Completa todas las lecciones de Python.",
                    Icon: "🎓"
                )
            );
        }


        /*
         * ⭐ 500 XP
         */
        if (user.Xp >= 500)
        {
            candidates.Add(
                new UnlockedAchievement(
                    Code: "XP_500",
                    Title: "500 XP",
                    Description:
                        "Consigue 500 puntos de experiencia.",
                    Icon: "⭐"
                )
            );
        }


        /*
         * Solamente guardamos logros
         * que todavía no tenga.
         */
        var newAchievements =
            candidates
                .Where(
                    achievement =>
                        !existingSet.Contains(
                            achievement.Code
                        )
                )
                .ToList();


        foreach (
            var achievement
            in newAchievements
        )
        {
            _db.UserAchievements.Add(
                new UserAchievement
                {
                    UserId = user.Id,

                    AchievementCode =
                        achievement.Code,

                    UnlockedAt =
                        DateTime.UtcNow
                }
            );
        }


        if (newAchievements.Count > 0)
        {
            await _db.SaveChangesAsync();
        }


        return newAchievements;
    }
}
