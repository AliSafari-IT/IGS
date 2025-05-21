using Microsoft.EntityFrameworkCore;
using IGSPharma.Domain.Entities;

namespace IGSPharma.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Product entity
            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.Category).HasMaxLength(50);
                entity.Property(e => e.ImageUrl).HasMaxLength(255);
                entity.Property(e => e.Manufacturer).HasMaxLength(100);
                entity.Property(e => e.Dosage).HasMaxLength(100);
            });

            // Seed initial data
            SeedData(modelBuilder);
        }

        private void SeedData(ModelBuilder modelBuilder)
        {
            var categories = new[] { "prescription", "otc", "vitamins", "personal-care" };
            var products = new List<Product>();
            var random = new Random(123); // Using a seed for reproducibility

            // Generate 5 products for each category (20 total) for initial seeding
            for (int categoryIndex = 0; categoryIndex < categories.Length; categoryIndex++)
            {
                var category = categories[categoryIndex];
                for (int i = 1; i <= 5; i++)
                {
                    var id = $"{category}-{i}";
                    var name = GetProductName(category, i);
                    
                    products.Add(new Product
                    {
                        Id = id,
                        Name = name,
                        Price = Math.Round((decimal)(random.NextDouble() * 50 + 10), 2),
                        ImageUrl = $"https://placehold.co/200x200?text={category}+{i}",
                        Category = category,
                        Description = GetProductDescription(category, name),
                        InStock = random.NextDouble() > 0.2,
                        RequiresPrescription = category == "prescription",
                        Dosage = category != "personal-care" ? $"{random.Next(1, 4)} tablet(s) daily" : null,
                        Manufacturer = GetManufacturerName(category, random)
                    });
                }
            }

            modelBuilder.Entity<Product>().HasData(products);
        }

        private string GetProductName(string category, int index)
        {
            switch (category)
            {
                case "prescription":
                    var prescriptionNames = new[] { 
                        "Lisinopril", "Atorvastatin", "Levothyroxine", "Metformin", "Amlodipine" 
                    };
                    return $"{prescriptionNames[index - 1]} {(index * 10) + 10}mg";
                
                case "otc":
                    var otcNames = new[] { 
                        "Ibuprofen", "Acetaminophen", "Aspirin", "Loratadine", "Cetirizine" 
                    };
                    return $"{otcNames[index - 1]} {(index * 100) + 100}mg";
                
                case "vitamins":
                    var vitaminNames = new[] { 
                        "Vitamin D3", "Vitamin B12", "Multivitamin", "Vitamin C", "Omega-3" 
                    };
                    return $"{vitaminNames[index - 1]} {(index * 500) + 500}IU";
                
                case "personal-care":
                    var personalCareNames = new[] { 
                        "Hand Sanitizer", "Moisturizing Lotion", "Sunscreen", "Dental Floss", "Antiseptic Spray" 
                    };
                    return personalCareNames[index - 1];
                
                default:
                    return $"Product {index}";
            }
        }

        private string GetProductDescription(string category, string name)
        {
            switch (category)
            {
                case "prescription":
                    return $"{name} is a prescription medication that requires a valid prescription from a licensed healthcare provider.";
                case "otc":
                    return $"{name} is an over-the-counter medication for temporary relief of minor aches and pains.";
                case "vitamins":
                    return $"{name} helps support overall health and wellness as part of a balanced diet.";
                case "personal-care":
                    return $"{name} is designed for daily personal hygiene and self-care.";
                default:
                    return $"Description for {name}";
            }
        }

        private string GetManufacturerName(string category, Random random)
        {
            switch (category)
            {
                case "prescription":
                    var pharmaCompanies = new[] { "PharmaCorp", "MediPharm", "HealthRx", "VitaLabs", "CureTech" };
                    return pharmaCompanies[random.Next(pharmaCompanies.Length)];
                case "otc":
                    var otcCompanies = new[] { "ConsumerHealth", "WellnessCare", "ReliefMed", "DailyHealth", "ComfortPharm" };
                    return otcCompanies[random.Next(otcCompanies.Length)];
                case "vitamins":
                    var vitaminCompanies = new[] { "NaturalHealth", "VitaEssentials", "PureNutrition", "OrganicLife", "WellnessPlus" };
                    return vitaminCompanies[random.Next(vitaminCompanies.Length)];
                case "personal-care":
                    var careCompanies = new[] { "CareProducts", "DailyCare", "PureSkin", "HygieneFirst", "CleanLiving" };
                    return careCompanies[random.Next(careCompanies.Length)];
                default:
                    return "Generic Manufacturer";
            }
        }
    }
}
