using System;
using System.Linq;
using System.Reflection;
using IGSPharma.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace IGSPharma.API.Tests.Helpers
{
    // Marker interface to identify the assembly where the Program class is located
    public interface IAssemblyMarker { }

    public class CustomWebApplicationFactory : WebApplicationFactory<IAssemblyMarker>
    {
        protected override IHostBuilder CreateHostBuilder()
        {
            // Get the assembly where the Program class is located
            var assembly = typeof(IGSPharma.API.Controllers.ProductsController).Assembly;

            return Host.CreateDefaultBuilder()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<TestStartup>();
                });
        }

        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");

            builder.ConfigureServices(services =>
            {
                // Find and remove the real database context registration
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<ApplicationDbContext>));

                if (descriptor != null)
                {
                    services.Remove(descriptor);
                }

                // Add in-memory database with a persistent name to ensure the same instance is used throughout the test
                services.AddDbContext<ApplicationDbContext>(options =>
                {
                    options.UseInMemoryDatabase("InMemoryDbForTesting");
                });

                // Replace the real repository with a scoped instance to ensure it uses our test database
                var serviceProvider = services.BuildServiceProvider();

                // Create a scope to obtain a reference to the database context
                using (var scope = serviceProvider.CreateScope())
                {
                    var scopedServices = scope.ServiceProvider;
                    var db = scopedServices.GetRequiredService<ApplicationDbContext>();

                    // Clear the database to ensure a clean state
                    db.Products.RemoveRange(db.Products);
                    db.SaveChanges();

                    // Ensure the database is created
                    db.Database.EnsureCreated();

                    // Seed with test data
                    SeedTestData(db);
                }
            });
        }

        private void SeedTestData(ApplicationDbContext db)
        {
            // Add test data to the in-memory database
            if (!db.Products.Any())
            {
                db.Products.AddRange(
                    new IGSPharma.Domain.Entities.Product
                    {
                        Id = "1",
                        Name = "Test Product 1",
                        Description = "Test Description 1",
                        Price = 9.99m,
                        Category = "Test Category",
                        ImageUrl = "test-image-1.jpg",
                        InStock = true,
                        RequiresPrescription = false,
                        Manufacturer = "Test Manufacturer"
                    },
                    new IGSPharma.Domain.Entities.Product
                    {
                        Id = "2",
                        Name = "Test Product 2",
                        Description = "Test Description 2",
                        Price = 19.99m,
                        Category = "Test Category",
                        ImageUrl = "test-image-2.jpg",
                        InStock = true,
                        RequiresPrescription = true,
                        Dosage = "10mg",
                        Manufacturer = "Test Manufacturer 2"
                    }
                );
                db.SaveChanges();
            }
        }
    }
}
