using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

using Microsoft.IdentityModel.Tokens;

namespace OsoCoddy.Api.Services;

public class ChallengeProofService
{
    private readonly string _jwtKey;

    public ChallengeProofService(
        IConfiguration configuration
    )
    {
        _jwtKey =
            configuration["Jwt:Key"]
            ?? throw new InvalidOperationException(
                "JWT Key no configurada."
            );
    }


    public string CreateProof(
        int userId,
        string courseSlug,
        int lessonId
    )
    {
        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                userId.ToString()
            ),

            new Claim(
                "courseSlug",
                courseSlug
                    .Trim()
                    .ToLowerInvariant()
            ),

            new Claim(
                "lessonId",
                lessonId.ToString()
            ),

            new Claim(
                "tokenType",
                "challenge-proof"
            )
        };


        var key =
            new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    _jwtKey
                )
            );


        var credentials =
            new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );


        var token =
            new JwtSecurityToken(
                issuer:
                    "osocoddy-challenge",

                audience:
                    "osocoddy-completion",

                claims:
                    claims,

                expires:
                    DateTime.UtcNow
                        .AddMinutes(10),

                signingCredentials:
                    credentials
            );


        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }


    public bool ValidateProof(
        string proof,
        int userId,
        string courseSlug,
        int lessonId
    )
    {
        try
        {
            var key =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        _jwtKey
                    )
                );


            var parameters =
                new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,

                    ValidIssuer =
                        "osocoddy-challenge",

                    ValidAudience =
                        "osocoddy-completion",

                    IssuerSigningKey =
                        key,

                    ClockSkew =
                        TimeSpan.Zero
                };


            var principal =
                new JwtSecurityTokenHandler()
                    .ValidateToken(
                        proof,
                        parameters,
                        out _
                    );


            var proofUserId =
                principal.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );


            var proofCourse =
                principal.FindFirstValue(
                    "courseSlug"
                );


            var proofLesson =
                principal.FindFirstValue(
                    "lessonId"
                );


            var tokenType =
                principal.FindFirstValue(
                    "tokenType"
                );


            return
                proofUserId ==
                    userId.ToString() &&

                proofCourse ==
                    courseSlug
                        .Trim()
                        .ToLowerInvariant() &&

                proofLesson ==
                    lessonId.ToString() &&

                tokenType ==
                    "challenge-proof";
        }
        catch
        {
            return false;
        }
    }
}