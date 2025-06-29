using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IGSPharma.Domain.Entities;
using IGSPharma.Domain.Interfaces;

namespace IGSPharma.API.Tests.Helpers
{
    public class TestProductRepository : IProductRepository
    {
        private readonly List<Product> _products;

        public TestProductRepository()
        {
            // Initialize with test data
            _products = new List<Product>
            {
                new Product
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
                new Product
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
            };
        }

        public Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return Task.FromResult<IEnumerable<Product>>(_products);
        }

        public Task<Product?> GetProductByIdAsync(string id)
        {
            return Task.FromResult(_products.FirstOrDefault(p => p.Id == id));
        }

        public Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
        {
            return Task.FromResult<IEnumerable<Product>>(
                _products.Where(p => p.Category.ToLower() == category.ToLower()).ToList());
        }

        public Task<IEnumerable<Product>> SearchProductsAsync(string query)
        {
            return Task.FromResult<IEnumerable<Product>>(
                _products.Where(p =>
                    p.Name.ToLower().Contains(query.ToLower()) ||
                    (p.Description != null && p.Description.ToLower().Contains(query.ToLower()))
                ).ToList());
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
    }
}
