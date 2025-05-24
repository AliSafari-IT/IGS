using IGSPharma.Core.Interfaces;
using IGSPharma.Domain.Interfaces;
using IGSPharma.Domain.Repositories;
using IGSPharma.Infrastructure.Data;
using IGSPharma.Infrastructure.Repositories;
using IGSPharma.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IGSPharma.API.Tests.Helpers
{
    public static class InfrastructureExtensions
    {
        public static IServiceCollection AddInfrastructureForTesting(
            this IServiceCollection services,
            IConfiguration configuration)
        {
            // Register DbContext with InMemory provider
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseInMemoryDatabase("InMemoryDbForTesting"));

            // Register repositories
            services.AddScoped<IProductRepository, ProductRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            
            // Register services
            services.AddScoped<IJwtService, JwtService>();

            return services;
        }
    }
}
