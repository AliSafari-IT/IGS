using IGSPharma.Application.Interfaces;
using IGSPharma.Application.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace IGSPharma.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(
            this IServiceCollection services,
            IConfiguration configuration
        )
        {
            // Register application services
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IChangelogService, ChangelogService>();
            return services;
        }
    }
}
