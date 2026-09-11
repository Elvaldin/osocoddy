using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using OsoCoddy.Api.DTOs.Challenges;
using OsoCoddy.Api.DTOs.Code;
using OsoCoddy.Api.Data;
using OsoCoddy.Api.DTOs.Auth;
using OsoCoddy.Api.Models;
using OsoCoddy.Api.DTOs.Progress;
using OsoCoddy.Api.Services;



var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();

var jwtKey = builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException("JWT Key no configurada.");

var jwtIssuer = builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException("JWT Issuer no configurado.");

var jwtAudience = builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException("JWT Audience no configurado.");

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey)
            ),

            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

var frontendUrl =
    builder.Configuration["FrontendUrl"]
    ?? "http://localhost:5173";

builder.Services.AddCors(options =>
{
    options.AddPolicy("OsoCoddyWeb", policy =>
    {
        policy
            .WithOrigins(frontendUrl.TrimEnd('/'))
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddSingleton<CodeExecutionService>();
builder.Services.AddSingleton<ChallengeJudgeService>();

builder.Services.AddScoped<AchievementService>();
builder.Services.AddSingleton<ChallengeProofService>();

var app = builder.Build();


app.UseCors("OsoCoddyWeb");

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () =>
{
    return "🐻 osoCoddy API";
});

app.MapGet("/api/health", () =>
{
    return Results.Ok(new
    {
        status = "ok",
        application = "osoCoddy API",
        version = "0.1"
    });
});

app.MapPost(
    "/api/auth/register",
    async (
        RegisterRequest request,
        AppDbContext db,
        IPasswordHasher<User> passwordHasher
    ) =>
    {
        if (string.IsNullOrWhiteSpace(request.Username))
        {
            return Results.BadRequest(new
            {
                message = "El nombre de usuario es obligatorio."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Email))
        {
            return Results.BadRequest(new
            {
                message = "El correo electrónico es obligatorio."
            });
        }

        if (string.IsNullOrWhiteSpace(request.Password))
        {
            return Results.BadRequest(new
            {
                message = "La contraseña es obligatoria."
            });
        }

        if (request.Password.Length < 8)
        {
            return Results.BadRequest(new
            {
                message = "La contraseña debe tener al menos 8 caracteres."
            });
        }

        if (request.Password != request.ConfirmPassword)
        {
            return Results.BadRequest(new
            {
                message = "Las contraseñas no coinciden."
            });
        }

        var username = request.Username.Trim();
        var email = request.Email.Trim().ToLowerInvariant();

        var usernameExists = await db.Users
            .AnyAsync(user => user.Username == username);

        if (usernameExists)
        {
            return Results.Conflict(new
            {
                message = "El nombre de usuario ya está registrado."
            });
        }

        var emailExists = await db.Users
            .AnyAsync(user => user.Email == email);

        if (emailExists)
        {
            return Results.Conflict(new
            {
                message = "El correo electrónico ya está registrado."
            });
        }

        var user = new User
        {
            Username = username,
            Email = email,
            Xp = 0,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = passwordHasher.HashPassword(
            user,
            request.Password
        );

        db.Users.Add(user);

        await db.SaveChangesAsync();

        return Results.Created(
            $"/api/users/{user.Id}",
            new
            {
                id = user.Id,
                username = user.Username,
                email = user.Email,
                xp = user.Xp,
                createdAt = user.CreatedAt
            }
        );
    }
);

app.MapPost(
    "/api/auth/login",
    async (
        LoginRequest request,
        AppDbContext db,
        IPasswordHasher<User> passwordHasher
    ) =>
    {
        if (string.IsNullOrWhiteSpace(request.Email) ||
            string.IsNullOrWhiteSpace(request.Password))
        {
            return Results.BadRequest(new
            {
                message = "Correo y contraseña son obligatorios."
            });
        }

        var email = request.Email
            .Trim()
            .ToLowerInvariant();

        var user = await db.Users
            .FirstOrDefaultAsync(user => user.Email == email);

        if (user is null)
        {
            return Results.Unauthorized();
        }

        var passwordResult =
            passwordHasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password
            );

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return Results.Unauthorized();
        }

        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()
            ),

            new Claim(
                ClaimTypes.Name,
                user.Username
            ),

            new Claim(
                ClaimTypes.Email,
                user.Email
            )
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtKey)
        );

        var credentials = new SigningCredentials(
            key,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: jwtIssuer,
            audience: jwtAudience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(2),
            signingCredentials: credentials
        );

        var tokenString =
            new JwtSecurityTokenHandler()
                .WriteToken(token);

        return Results.Ok(new
        {
            token = tokenString,

            user = new
            {
                id = user.Id,
                username = user.Username,
                email = user.Email,
                xp = user.Xp
            }
        });
    }
);

app.MapPost(
    "/api/progress/complete",
    async (
        CompleteLessonRequest request,
        ClaimsPrincipal claims,
        AppDbContext db,
        AchievementService achievementService,
        ChallengeProofService proofService
    ) =>
    {
        var userIdValue = claims.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Results.Unauthorized();
        }

        if (string.IsNullOrWhiteSpace(request.CourseSlug))
        {
            return Results.BadRequest(new
            {
                message = "El curso es obligatorio."
            });
        }

        if (request.LessonId <= 0)
        {
            return Results.BadRequest(new
            {
                message = "La lección no es válida."
            });
        }

        var user = await db.Users.FindAsync(userId);

        if (user is null)
        {
            return Results.NotFound(new
            {
                message = "Usuario no encontrado."
            });
        }

        var courseSlug = request.CourseSlug
            .Trim()
            .ToLowerInvariant();

        var alreadyCompleted = await db.UserProgress
            .AnyAsync(progress =>
                progress.UserId == userId &&
                progress.CourseSlug == courseSlug &&
                progress.LessonId == request.LessonId
            );

        /*
         * Si la lección ya estaba completada:
         * - no gana XP nuevamente
         * - no aumenta la racha
         */
        if (alreadyCompleted)
        {
            return Results.Ok(new
            {
                message = "Esta lección ya estaba completada.",
                alreadyCompleted = true,

                xp = user.Xp,
                totalXp = user.Xp,

                currentStreak = user.CurrentStreak,
                longestStreak = user.LongestStreak,
                lastActivityDate = user.LastActivityDate
            });
        }

        /*
        * ==========================================
        * 🔐 VALIDACIÓN DEL MINI RETO
        * ==========================================
        *
        * Las lecciones 1–12 de Python solamente
        * pueden completarse si antes aprobaron
        * el reto en /api/challenges/check.
        */

        var requiresChallengeProof =
            courseSlug == "python" &&
            request.LessonId >= 1 &&
            request.LessonId <= 12;


        if (requiresChallengeProof)
        {
            /*
            * No se recibió ninguna prueba.
            */
            if (
                string.IsNullOrWhiteSpace(
                    request.ChallengeProof
                )
            )
            {
                return Results.Json(
                    new
                    {
                        message =
                            "Debes aprobar el mini reto antes de completar la lección."
                    },
                    statusCode:
                        StatusCodes.Status403Forbidden
                );
            }


            /*
            * Comprobamos:
            *
            * - Firma
            * - Expiración
            * - Usuario
            * - Curso
            * - Lección
            */
            var validProof =
                proofService.ValidateProof(
                    request.ChallengeProof,
                    userId,
                    courseSlug,
                    request.LessonId
                );


            if (!validProof)
            {
                return Results.Json(
                    new
                    {
                        message =
                            "La prueba del mini reto no es válida o ha expirado. Comprueba nuevamente tu respuesta."
                    },
                    statusCode:
                        StatusCodes.Status403Forbidden
                );
            }
        }

        /*
         * ==========================================
         * 🔥 RACHA DIARIA
         * ==========================================
         */

        var mexicoTimeZone =
            TimeZoneInfo.FindSystemTimeZoneById(
                "America/Mexico_City"
            );

        var nowUtc = DateTime.UtcNow;

        var today =
            TimeZoneInfo.ConvertTimeFromUtc(
                nowUtc,
                mexicoTimeZone
            ).Date;


        /*
         * Primera actividad del usuario.
         */
        if (user.LastActivityDate is null)
        {
            user.CurrentStreak = 1;
            user.LongestStreak = 1;
        }
        else
        {
            var lastActivityLocal =
                TimeZoneInfo.ConvertTimeFromUtc(
                    user.LastActivityDate.Value,
                    mexicoTimeZone
                ).Date;


            /*
             * Ya completó otra lección hoy.
             * La racha NO aumenta.
             */
            if (lastActivityLocal == today)
            {
                // Mantener la racha.
            }


            /*
             * La última actividad fue ayer.
             * La racha aumenta.
             */
            else if (
                lastActivityLocal ==
                today.AddDays(-1)
            )
            {
                user.CurrentStreak++;

                if (
                    user.CurrentStreak >
                    user.LongestStreak
                )
                {
                    user.LongestStreak =
                        user.CurrentStreak;
                }
            }


            /*
             * Dejó pasar uno o más días.
             * La racha actual vuelve a 1.
             */
            else
            {
                user.CurrentStreak = 1;
            }
        }


        /*
         * Guardamos la actividad en UTC.
         */
        user.LastActivityDate = nowUtc;


        /*
         * ==========================================
         * ⭐ XP + PROGRESO
         * ==========================================
         */

        const int xpReward = 50;

        var progress = new UserProgress
        {
            UserId = userId,
            CourseSlug = courseSlug,
            LessonId = request.LessonId,
            Completed = true,
            XpEarned = xpReward,
            CompletedAt = nowUtc
        };

        user.Xp += xpReward;

        db.UserProgress.Add(progress);

        /*
         * EF guarda:
         * - UserProgress
         * - XP
         * - CurrentStreak
         * - LongestStreak
         * - LastActivityDate
         */
        await db.SaveChangesAsync();

        var newAchievements =
            await achievementService
                .CheckAndUnlockAsync(
                    user
                );

        return Results.Ok(new
        {
            message = "Lección completada.",

            alreadyCompleted = false,

            xpEarned = xpReward,

            totalXp = user.Xp,

            currentStreak =
                user.CurrentStreak,

            longestStreak =
                user.LongestStreak,

            lastActivityDate =
                user.LastActivityDate,

            newAchievements,

            progress = new
            {
                courseSlug =
                    progress.CourseSlug,

                lessonId =
                    progress.LessonId,

                completedAt =
                    progress.CompletedAt
            }
        });
    }
)
.RequireAuthorization();

app.MapGet(
    "/api/progress/me",
    async (
        ClaimsPrincipal claims,
        AppDbContext db
    ) =>
    {
        var userIdValue = claims.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (!int.TryParse(userIdValue, out var userId))
        {
            return Results.Unauthorized();
        }

        var user = await db.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(
                user => user.Id == userId
            );

        if (user is null)
        {
            return Results.NotFound(new
            {
                message = "Usuario no encontrado."
            });
        }

        var completedLessons =
            await db.UserProgress
                .AsNoTracking()
                .Where(progress =>
                    progress.UserId == userId &&
                    progress.Completed
                )
                .OrderBy(progress =>
                    progress.CompletedAt
                )
                .Select(progress => new
                {
                    progress.CourseSlug,
                    progress.LessonId,
                    progress.XpEarned,
                    progress.CompletedAt
                })
                .ToListAsync();

        var achievements =
            await db.UserAchievements
                .AsNoTracking()
                .Where(
                    achievement =>
                        achievement.UserId ==
                        userId
                )
                .OrderBy(
                    achievement =>
                        achievement.UnlockedAt
                )
                .Select(
                    achievement => new
                    {
                        code =
                            achievement
                                .AchievementCode,

                        unlockedAt =
                            achievement
                                .UnlockedAt
                    }
                )
                .ToListAsync();

        var mexicoTimeZone =
            TimeZoneInfo.FindSystemTimeZoneById(
                "America/Mexico_City"
            );

        var today =
            TimeZoneInfo.ConvertTimeFromUtc(
                DateTime.UtcNow,
                mexicoTimeZone
            ).Date;

        var effectiveCurrentStreak =
            user.CurrentStreak;

        if (user.LastActivityDate is not null)
        {
            var lastActivityLocal =
                TimeZoneInfo.ConvertTimeFromUtc(
                    user.LastActivityDate.Value,
                    mexicoTimeZone
                ).Date;

            /*
            * Si la última actividad fue antes de ayer,
            * la racha ya se perdió.
            */
            if (lastActivityLocal < today.AddDays(-1))
            {
                effectiveCurrentStreak = 0;
            }
        }

        return Results.Ok(new
        {
           totalXp = user.Xp,

            currentStreak = effectiveCurrentStreak,
            longestStreak = user.LongestStreak,
            lastActivityDate = user.LastActivityDate,

            achievements,

            completedLessons

        });
    }
)
.RequireAuthorization();

app.MapPost(
    "/api/code/run/python",
    async (
        RunCodeRequest request,
        CodeExecutionService executor
    ) =>
    {
        if (string.IsNullOrWhiteSpace(request.Code))
        {
            return Results.BadRequest(new
            {
                message =
                    "Debes escribir código para ejecutarlo."
            });
        }

        if (request.Code.Length > 5000)
        {
            return Results.BadRequest(new
            {
                message =
                    "El código es demasiado largo."
            });
        }

        var execution =
            await executor.RunPythonAsync(
                request.Code
            );

        if (execution.TimedOut)
        {
            return Results.Ok(new
            {
                success = false,
                output = "",
                error =
                    "Tiempo de ejecución excedido."
            });
        }

        return Results.Ok(new
        {
            success = execution.Success,

            output =
                execution.Output,

            error =
                string.IsNullOrWhiteSpace(
                    execution.Error
                )
                    ? null
                    : execution.Error
        });
    }
)
.RequireAuthorization();

app.MapPost(
    "/api/challenges/check",
    async (
        CheckChallengeRequest request,
        ClaimsPrincipal claims,
        ChallengeJudgeService judge,
        ChallengeProofService proofService
    ) =>
    {
        if (
            string.IsNullOrWhiteSpace(
                request.CourseSlug
            )
        )
        {
            return Results.BadRequest(new
            {
                message =
                    "El curso es obligatorio."
            });
        }

        if (request.LessonId <= 0)
        {
            return Results.BadRequest(new
            {
                message =
                    "La lección no es válida."
            });
        }

        if (
            string.IsNullOrWhiteSpace(
                request.Code
            )
        )
        {
            return Results.BadRequest(new
            {
                message =
                    "Debes escribir código."
            });
        }

        if (request.Code.Length > 5000)
        {
            return Results.BadRequest(new
            {
                message =
                    "El código es demasiado largo."
            });
        }


        var result =
            await judge.CheckAsync(
                request.CourseSlug,
                request.LessonId,
                request.Code
            );


        if (!result.Supported)
        {
            return Results.BadRequest(new
            {
                message =
                    result.Message
            });
        }

        string? proof = null;

        if (result.Correct)
        {
            var userIdValue =
                claims.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );

            if (!int.TryParse(
                userIdValue,
                out var userId
            ))
            {
                return Results.Unauthorized();
            }

            proof =
                proofService.CreateProof(
                    userId,
                    request.CourseSlug,
                    request.LessonId
                );
        }

        return Results.Ok(new
        {
            correct =
                result.Correct,

            message =
                result.Message,

            output =
                result.Output,

            error =
                result.Error,

            proof
        });
    }
)
.RequireAuthorization();

app.Run();