using IGSPharma.Domain.Entities;
using IGSPharma.Domain.Interfaces;
using IGSPharma.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IGSPharma.Infrastructure.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _context;

        public ProductRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<Product?> GetProductByIdAsync(string id)
        {
            return await _context.Products.FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
        {
            return await _context
                .Products.Where(p => p.Category.ToLower() == category.ToLower())
                .ToListAsync();
        }

        public async Task<IEnumerable<Product>> SearchProductsAsync(string query)
        {
            return await _context
                .Products.Where(p =>
                    p.Name.ToLower().Contains(query.ToLower())
                    || (p.Description != null && p.Description.ToLower().Contains(query.ToLower()))
                )
                .ToListAsync();
        }

        public async Task<Product> CreateProductAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
            return product;
        }

        public async Task<bool> DeleteProductAsync(string id)
        {
            var product = await GetProductByIdAsync(id);
            if (product == null)
            {
                return false;
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
