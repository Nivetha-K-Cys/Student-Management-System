using StudentManagement.Api.Models;

namespace StudentManagement.Api.Services.Interfaces;

public interface IJwtTokenService
{
    (string Token, DateTime ExpiresAtUtc) GenerateToken(User user);
}