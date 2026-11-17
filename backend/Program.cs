using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

using StudentManagement.Api.Configuration;
using StudentManagement.Api.Data;
using StudentManagement.Api.Middleware;
using StudentManagement.Api.Models;

using StudentManagement.Api.Repositories.Interfaces;
using StudentManagement.Api.Repositories.Implementations;

using StudentManagement.Api.Services.Interfaces;
using StudentManagement.Api.Services.Implementations;

var builder = WebApplication.CreateBuilder(args);

// 1. Controllers and OpenAPI
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// 2. Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString(
            "DefaultConnection"));
});

// 3. Repository dependency injection
builder.Services.AddScoped<IUserRepository, UserRepository>();

// 4. Service dependency injection
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

// 5. Password hashing
builder.Services.AddScoped<
    IPasswordHasher<User>,
    PasswordHasher<User>>();

// 6. JWT configuration
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("Jwt"));

var jwtSettings = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtSettings>()
    ?? throw new InvalidOperationException(
        "JWT settings are missing.");

if (string.IsNullOrWhiteSpace(jwtSettings.Issuer) ||
    string.IsNullOrWhiteSpace(jwtSettings.Audience) ||
    Encoding.UTF8.GetByteCount(jwtSettings.Key) < 32 ||
    jwtSettings.ExpiryMinutes <= 0)
{
    throw new InvalidOperationException(
        "JWT configuration is invalid.");
}

// 7. JWT authentication
builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(
                            jwtSettings.Key)),

                ClockSkew = TimeSpan.Zero
            };
    });

// 8. Authorization
builder.Services.AddAuthorization();

// 9. Angular CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularApp", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// 10. Global exception middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

// 11. Development-only setup
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

    using var scope = app.Services.CreateScope();

    var context = scope.ServiceProvider
        .GetRequiredService<ApplicationDbContext>();

    var hasher = scope.ServiceProvider
        .GetRequiredService<IPasswordHasher<User>>();

    await AuthDataSeeder.SeedAsync(
        context,
        app.Configuration,
        hasher);
}

// 12. Middleware pipeline
app.UseHttpsRedirection();

app.UseCors("AngularApp");

app.UseAuthentication();

app.UseAuthorization();

// 13. Controller endpoints
app.MapControllers();

app.Run();