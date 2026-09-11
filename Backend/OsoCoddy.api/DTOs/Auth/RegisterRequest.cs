namespace OsoCoddy.Api.DTOs.Auth;

public record RegisterRequest(
    string Username,
    string Email,
    string Password,
    string ConfirmPassword
);