using Microsoft.EntityFrameworkCore;
using OsoCoddy.Api.Models;

namespace OsoCoddy.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    public DbSet<UserProgress> UserProgress { get; set; }

    public DbSet<UserAchievement> UserAchievements =>
        Set<UserAchievement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(user => user.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(user => user.Username)
            .IsUnique();

        modelBuilder.Entity<UserProgress>()
            .HasIndex(progress => new
            {
                progress.UserId,
                progress.CourseSlug,
                progress.LessonId
            })
            .IsUnique();

        modelBuilder.Entity<UserProgress>()
            .HasOne(progress => progress.User)
            .WithMany(user => user.Progress)
            .HasForeignKey(progress => progress.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserAchievement>()
            .HasIndex(achievement => new
            {
                achievement.UserId,
                achievement.AchievementCode
            })
            .IsUnique();

        modelBuilder.Entity<UserAchievement>()
            .HasOne(achievement => achievement.User)
            .WithMany(user => user.Achievements)
            .HasForeignKey(achievement => achievement.UserId)
            .OnDelete(DeleteBehavior.Cascade);

    }
}