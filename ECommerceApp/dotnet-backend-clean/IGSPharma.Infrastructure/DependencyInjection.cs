using IGSPharma.Domain.Interfaces;
using IGSPharma.Infrastructure.Data;
using IGSPharma.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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

            return services;
        }
    }
}
