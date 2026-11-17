using StudentManagement.Api.Models;

namespace StudentManagement.Api.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
}