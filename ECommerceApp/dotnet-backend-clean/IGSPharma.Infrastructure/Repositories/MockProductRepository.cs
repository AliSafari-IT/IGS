using IGSPharma.Domain.Entities;
using IGSPharma.Domain.Interfaces;

namespace IGSPharma.Infrastructure.Repositories
{
    public class MockProductRepository : IProductRepository
    {
        private readonly List<Product> _products;
        private readonly Random _random = new Random();

        public MockProductRepository()
        {
            _products = GenerateMockProducts();
        }

        public Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return Task.FromResult<IEnumerable<Product>>(_products);
        }

        public Task<Product?> GetProductByIdAsync(string id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            return Task.FromResult(product);
        }

        public Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
        {
            var products = _products.Where(p => p.Category.ToLower() == category.ToLower());
            return Task.FromResult(products);
        }

        public Task<IEnumerable<Product>> SearchProductsAsync(string query)
        {
            var products = _products.Where(p =>
                p.Name.ToLower().Contains(query.ToLower()) ||
                (p.Description != null && p.Description.ToLower().Contains(query.ToLower()))
            );
            return Task.FromResult(products);
        }

        private List<Product> GenerateMockProducts()
        {
            var products = new List<Product>();
            var categories = new[] { "prescription", "otc", "vitamins", "personal-care" };
            var categoryNames = new Dictionary<string, string>
            {
                { "prescription", "Prescription Medication" },
                { "otc", "Over-the-Counter" },
                { "vitamins", "Vitamin Supplement" },
                { "personal-care", "Personal Care Product" }
            };

            // Generate 25 products for each category (100 total)
            foreach (var category in categories)
            {
                for (int i = 1; i <= 25; i++)
                {
                    products.Add(new Product
                    {
                        Id = $"{category}-{i}",
                        Name = $"{categoryNames[category]} {i}",
                        Price = Math.Round((decimal)(_random.NextDouble() * 50 + 10), 2),
                        ImageUrl = $"https://placehold.co/200x200?text={category}+{i}",
                        Category = category,
                        Description = $"This is a {categoryNames[category].ToLower()} that {(category == "prescription" ? "requires a valid prescription from a licensed healthcare provider" : "is available without prescription")}.",
                        InStock = _random.NextDouble() > 0.2,
                        RequiresPrescription = category == "prescription",
                        Dosage = category != "personal-care" ? $"{_random.Next(1, 4)} tablet(s) daily" : null,
                        Manufacturer = $"{(category == "vitamins" ? "NaturalHealth" : category == "personal-care" ? "CareProducts" : "PharmaCorp")} {_random.Next(1, 6)}"
                    });
                }
            }

            return products;
        }
    }
}
