using IGSPharma.Application.Interfaces;
using IGSPharma.Core.Interfaces;
using IGSPharma.Domain.Interfaces;
using IGSPharma.Domain.Repositories;
using IGSPharma.Infrastructure.Data;
using IGSPharma.Infrastructure.Repositories;
using IGSPharma.Infrastructure.Services;
using IGSPharma.Infrastructure.Settings;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace IGSPharma.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            // Register DbContext
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseMySql(
                    configuration.GetConnectionString("DefaultConnection"),
                    ServerVersion.AutoDetect(
                        configuration.GetConnectionString("DefaultConnection")
                    ),
                    b => b.MigrationsAssembly("IGSPharma.Infrastructure")
                )
            );

            // Register repositories
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IChangelogRepository, ChangelogRepository>();

            // Register services
            services.AddScoped<IJwtService, JwtService>();

            // Register email service
            services.AddScoped<IEmailService, EmailService>();

            return services;
        }
    }
}
