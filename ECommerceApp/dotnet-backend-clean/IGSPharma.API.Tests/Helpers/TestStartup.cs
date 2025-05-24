using System;
using System.Text;
using IGSPharma.Application;
using IGSPharma.Application.Interfaces;
using IGSPharma.Application.Services;
using IGSPharma.Domain.Interfaces;
using IGSPharma.Infrastructure;
using IGSPharma.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;

namespace IGSPharma.API.Tests.Helpers
{
    public class TestStartup
    {
        public IConfiguration Configuration { get; }

        public TestStartup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Register controllers
            services.AddControllers().AddApplicationPart(typeof(IGSPharma.API.Controllers.ProductsController).Assembly);
            
            // Register Swagger
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            
            // Register our test repository
            services.AddScoped<IProductRepository, TestProductRepository>();
            
            // Register application services
            services.AddScoped<IProductService, ProductService>();
            
            // Register infrastructure services with InMemory database
            services.AddInfrastructureForTesting(Configuration);
            
            // Override the product repository with our test repository
            services.AddScoped<IProductRepository, TestProductRepository>();
            
            // Register application layer
            services.AddApplication(Configuration);
            
            // Configure JWT Authentication
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = Configuration["Jwt:Issuer"],
                        ValidAudience = Configuration["Jwt:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(Configuration["Jwt:SecretKey"] ?? "TestSecretKeyForDevelopment12345678901234")
                        ),
                    };
                });
            
            // Configure CORS
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin()
                           .AllowAnyMethod()
                           .AllowAnyHeader();
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Configure the HTTP request pipeline
            if (env.IsDevelopment() || env.IsEnvironment("Testing"))
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseRouting();
            
            // Add CORS middleware
            app.UseCors();

            // Add authentication middleware
            app.UseAuthentication();
            app.UseAuthorization();
            
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
