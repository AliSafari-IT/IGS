using IGSPharma.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace IGSPharma.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Prescription> Prescriptions { get; set; }
        public DbSet<PrescriptionItem> PrescriptionItems { get; set; }

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

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.PasswordHash).IsRequired();
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PhoneNumber).HasMaxLength(20);
                entity.Property(e => e.Role).IsRequired().HasMaxLength(20);

                // Configure relationships
                entity
                    .HasMany(u => u.Addresses)
                    .WithOne(a => a.User)
                    .HasForeignKey(a => a.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity
                    .HasMany(u => u.Orders)
                    .WithOne(o => o.User)
                    .HasForeignKey(o => o.UserId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity
                    .HasMany(u => u.Prescriptions)
                    .WithOne(p => p.User)
                    .HasForeignKey(p => p.UserId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Configure Address entity
            modelBuilder.Entity<Address>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.AddressLine1).IsRequired().HasMaxLength(100);
                entity.Property(e => e.AddressLine2).HasMaxLength(100);
                entity.Property(e => e.City).IsRequired().HasMaxLength(50);
                entity.Property(e => e.State).IsRequired().HasMaxLength(50);
                entity.Property(e => e.PostalCode).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Country).IsRequired().HasMaxLength(50);
                entity.Property(e => e.AddressType).IsRequired().HasMaxLength(20);
            });

            // Configure Order entity
            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.OrderNumber).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
                entity.Property(e => e.SubTotal).HasColumnType("decimal(18,2)");
                entity.Property(e => e.ShippingCost).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TaxAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalAmount).HasColumnType("decimal(18,2)");
                entity.Property(e => e.PaymentMethod).HasMaxLength(50);
                entity.Property(e => e.PaymentStatus).IsRequired().HasMaxLength(20);
                entity.Property(e => e.TrackingNumber).HasMaxLength(50);
                entity.Property(e => e.ShippingMethod).HasMaxLength(50);
                entity.Property(e => e.Notes).HasMaxLength(500);

                // Configure relationships
                entity
                    .HasMany(o => o.Items)
                    .WithOne(i => i.Order)
                    .HasForeignKey(i => i.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure OrderItem entity
            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.ProductName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Price).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TotalPrice).HasColumnType("decimal(18,2)");

                // Configure relationships
                entity
                    .HasOne(i => i.Product)
                    .WithMany()
                    .HasForeignKey(i => i.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity
                    .HasOne(i => i.Prescription)
                    .WithMany()
                    .HasForeignKey(i => i.PrescriptionId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .IsRequired(false);
            });

            // Configure Prescription entity
            modelBuilder.Entity<Prescription>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.PrescriptionNumber).IsRequired().HasMaxLength(20);
                entity.Property(e => e.DoctorName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.DoctorLicenseNumber).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Status).IsRequired().HasMaxLength(20);
                entity.Property(e => e.Notes).HasMaxLength(500);
                entity.Property(e => e.ImageUrl).HasMaxLength(255);

                // Configure relationships
                entity
                    .HasMany(p => p.Items)
                    .WithOne(i => i.Prescription)
                    .HasForeignKey(i => i.PrescriptionId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Configure PrescriptionItem entity
            modelBuilder.Entity<PrescriptionItem>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MedicationName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Dosage).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Frequency).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Instructions).HasMaxLength(500);

                // Configure relationships
                entity
                    .HasOne(i => i.Product)
                    .WithMany()
                    .HasForeignKey(i => i.ProductId)
                    .OnDelete(DeleteBehavior.Restrict);
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
                for (int i = 1; i <= 10; i++)
                {
                    var id = $"{category}-{i}";
                    var name = GetProductName(category, i);

                    products.Add(
                        new Product
                        {
                            Id = id,
                            Name = name,
                            Price = Math.Round((decimal)(random.NextDouble() * 50 + 10), 2),
                            Category = category,
                            Description = GetProductDescription(category, name),
                            InStock = random.NextDouble() > 0.2,
                            RequiresPrescription = category == "prescription",
                            Dosage =
                                category != "personal-care"
                                    ? $"{random.Next(1, 4)} tablet(s) daily"
                                    : null,
                            Manufacturer = GetManufacturerName(category, random),
                            ImageUrl = $"https://placehold.co/200x200?text={category}+{i}",
                            ExpiryDate = DateTime.Now.AddYears((int)(random.NextDouble() * 10 + 1)),
                            StockQuantity = random.Next(1, 100),
                            Barcode = $"{category}-{i}"
                        }
                    );
                }
            }

            modelBuilder.Entity<Product>().HasData(products);
        }

        private string GetProductName(string category, int index)
        {
            // Ensure index is within valid range (1-5)
            var safeIndex = Math.Clamp(index, 1, 5) - 1;

            switch (category)
            {
                case "prescription":
                    var prescriptionNames = new[] { "Lisinopril", "Atorvastatin", "Levothyroxine", "Metformin", "Amlodipine" };
                    return $"{prescriptionNames[safeIndex]} {(safeIndex + 1) * 10 + 10}mg";

                case "otc":
                    var otcNames = new[] { "Ibuprofen", "Acetaminophen", "Aspirin", "Loratadine", "Cetirizine" };
                    return $"{otcNames[safeIndex]} {(safeIndex + 1) * 100 + 100}mg";

                case "vitamins":
                    var vitaminNames = new[] { "Vitamin D3", "Vitamin B12", "Multivitamin", "Vitamin C", "Omega-3" };
                    return $"{vitaminNames[safeIndex]} {(safeIndex + 1) * 500 + 500}IU";

                case "personal-care":
                    var personalCareNames = new[] { "Hand Sanitizer", "Moisturizing Lotion", "Sunscreen", "Dental Floss", "Antiseptic Spray" };
                    return personalCareNames[safeIndex];

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
            string[] manufacturers;

            switch (category)
            {
                case "prescription":
                    manufacturers = new[] { "PharmaCorp", "MediPharm", "HealthRx", "VitaLabs", "CureTech" };
                    break;
                case "otc":
                    manufacturers = new[] { "ConsumerHealth", "WellnessCare", "ReliefMed", "DailyHealth", "ComfortPharm" };
                    break;
                case "vitamins":
                    manufacturers = new[] { "NaturalHealth", "VitaEssentials", "PureNutrition", "OrganicLife", "WellnessPlus" };
                    break;
                case "personal-care":
                    manufacturers = new[] { "CareProducts", "DailyCare", "PureSkin", "HygieneFirst", "CleanLiving" };
                    break;
                default:
                    return "Generic Manufacturer";
            }

            return manufacturers[random.Next(0, manufacturers.Length)];
        }
    }
}
