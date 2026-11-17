using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StudentManagement.Api.Models;

namespace StudentManagement.Api.Data;

public static class AuthDataSeeder
{
    public static async Task SeedAsync(
        ApplicationDbContext context,
        IConfiguration configuration,
        IPasswordHasher<User> passwordHasher)
    {
        foreach (var roleName in new[] { "Admin", "Staff" })
        {
            var role = await context.Roles
                .SingleOrDefaultAsync(r => r.RoleName == roleName);

            if (role == null)
            {
                role = new Role { RoleName = roleName };
                context.Roles.Add(role);
                await context.SaveChangesAsync();
            }

            var email = configuration[
                $"SeedUsers:{roleName}:Email"];

            var password = configuration[
                $"SeedUsers:{roleName}:Password"];

            if (string.IsNullOrWhiteSpace(email) ||
                string.IsNullOrWhiteSpace(password))
            {
                continue;
            }

            email = email.Trim().ToLowerInvariant();

            var exists = await context.Users
                .AnyAsync(u => u.Email == email);

            if (exists)
            {
                continue;
            }

            var user = new User
            {
                Name = $"{roleName} User",
                Email = email,
                RoleId = role.RoleId,
                IsActive = true
            };

            user.PasswordHash =
                passwordHasher.HashPassword(user, password);

            context.Users.Add(user);
            await context.SaveChangesAsync();
        }
    }
}