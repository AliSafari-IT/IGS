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

        public Task<Product> CreateProductAsync(Product product)
        {
            if (string.IsNullOrEmpty(product.Id))
            {
                product.Id = Guid.NewGuid().ToString();
            }
            _products.Add(product);
            return Task.FromResult(product);
        }

        public Task<Product> UpdateProductAsync(Product product)
        {
            var existingIndex = _products.FindIndex(p => p.Id == product.Id);
            if (existingIndex >= 0)
            {
                _products[existingIndex] = product;
            }
            return Task.FromResult(product);
        }

        public Task<bool> DeleteProductAsync(string id)
        {
            var product = _products.FirstOrDefault(p => p.Id == id);
            if (product != null)
            {
                _products.Remove(product);
                return Task.FromResult(true);
            }
            return Task.FromResult(false);
        }

        private List<Product> GenerateMockProducts()
        {
            var products = new List<Product>();
            var categories = new[] { "Pijnstillers", "Antibiotica", "Vitamines", "Huidverzorging", "Digestie", "Respiratie", "Cardiovasculair", "Andere" };
            var categoryDescriptions = new Dictionary<string, string>
            {
                { "Pijnstillers", "pijnstillend medicijn" },
                { "Antibiotica", "antibioticum" },
                { "Vitamines", "vitamine supplement" },
                { "Huidverzorging", "huidverzorgingsproduct" },
                { "Digestie", "spijsverteringsproduct" },
                { "Respiratie", "ademhalingsproduct" },
                { "Cardiovasculair", "hart- en vaatproduct" },
                { "Andere", "algemeen medisch product" }
            };

            // Generate some products for each category
            int productId = 1;
            foreach (var category in categories)
            {
                int productsInCategory = _random.Next(3, 8); // 3-7 products per category
                for (int i = 1; i <= productsInCategory; i++)
                {
                    var productName = GenerateProductName(category, i);
                    products.Add(new Product
                    {
                        Id = $"prod-{productId++}",
                        Name = productName,
                        Price = Math.Round((decimal)(_random.NextDouble() * 100 + 5), 2),
                        ImageUrl = $"https://placehold.co/200x200?text={Uri.EscapeDataString(productName)}",
                        Category = category,
                        Description = $"Dit is een hoogwaardig {categoryDescriptions[category]} voor {(category == "Antibiotica" ? "bacteriële infecties" : "algemeen gebruik")}.",
                        InStock = _random.NextDouble() > 0.2,
                        RequiresPrescription = category == "Antibiotica" || _random.NextDouble() > 0.7,
                        Dosage = GenerateDosage(category),
                        Manufacturer = GenerateManufacturer()
                    });
                }
            }

            return products;
        }

        private string GenerateProductName(string category, int index)
        {
            var names = category switch
            {
                "Pijnstillers" => new[] { "Ibuprofen", "Paracetamol", "Aspirine", "Naproxen", "Diclofenac" },
                "Antibiotica" => new[] { "Amoxicilline", "Azitromycine", "Cetirizine", "Doxycycline", "Flucloxacilline" },
                "Vitamines" => new[] { "Vitamine D3", "Vitamine B12", "Vitamine C", "Multivitamine", "Omega-3" },
                "Huidverzorging" => new[] { "Hydraterende Crème", "Zonnebrandcrème", "Anti-Aging Serum", "Reinigingslotion", "Bodylotion" },
                "Digestie" => new[] { "Probiotica", "Loperamide", "Buscopan", "Rennie", "Gaviscon" },
                "Respiratie" => new[] { "Hoestdrank", "Neusdruppels", "Inhalator", "Lozenges", "Ademhalingsspray" },
                "Cardiovasculair" => new[] { "Aspirine Cardio", "Lisinopril", "Atorvastatine", "Metoprolol", "Amlodipine" },
                _ => new[] { "Algemeen Product", "Medisch Hulpmiddel", "Zorgproduct", "Therapeutisch Product", "Medicijn" }
            };
            
            var baseName = names[_random.Next(names.Length)];
            var dosages = new[] { "25mg", "50mg", "100mg", "200mg", "500mg", "10ml", "20ml" };
            return $"{baseName} {dosages[_random.Next(dosages.Length)]}";
        }

        private string? GenerateDosage(string category)
        {
            if (category == "Huidverzorging") return null;
            
            var dosages = new[] { "1x daags", "2x daags", "3x daags", "Naar behoefte", "1 tablet per dag", "2 tabletten per dag" };
            return dosages[_random.Next(dosages.Length)];
        }

        private string GenerateManufacturer()
        {
            var manufacturers = new[] { "ConsumerHealth", "ReliefMed", "ComfortPharma", "WellnessCare", "HealthPlus", "PharmaVital", "MediCare", "VitalHealth" };
            return manufacturers[_random.Next(manufacturers.Length)];
        }
    }
}
