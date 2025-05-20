using IGSPharma.Domain.Entities;

namespace IGSPharma.Domain.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category);
        Task<Product?> GetProductByIdAsync(string id);
        Task<IEnumerable<Product>> SearchProductsAsync(string query);
    }
}
