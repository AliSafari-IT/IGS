using System.Text;
using IGSPharma.Application;
using IGSPharma.Application.Interfaces;
using IGSPharma.Application.Services;
using IGSPharma.Domain.Interfaces;
using IGSPharma.Infrastructure;
using IGSPharma.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Add Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register application services
builder.Services.AddScoped<IProductService, ProductService>();

// Register infrastructure services
builder.Services.AddInfrastructure(builder.Configuration);

// Register application layer
builder.Services.AddApplication(builder.Configuration);

// Configure JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"])
            ),
        };
    });

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowAll",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:8100", 
                    "https://localhost:8101", 
                    "http://localhost:3006", 
                    "http://localhost:3007", 
                    "http://127.0.0.1:54831",
                    "https://igs.asafarim.com",
                    "http://igs.asafarim.com")
                .AllowAnyMethod()
                .AllowAnyHeader()
                .AllowCredentials(); // Important for cookies/auth
        }
    );
});

// Ensure database is created
var app = builder.Build();

// Initialize the database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}

// App was already built above for database initialization

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    
    // Use CORS first in development
    app.UseCors("AllowAll");
    
    // Skip HTTPS redirection in development to avoid CORS preflight issues
    // app.UseHttpsRedirection();
}
else
{
    // In production, apply CORS but disable HTTPS redirection to avoid issues with nginx proxy
    app.UseCors("AllowAll");
    // Disable HTTPS redirection as nginx handles this
    // app.UseHttpsRedirection();
}

// Add authentication middleware
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
