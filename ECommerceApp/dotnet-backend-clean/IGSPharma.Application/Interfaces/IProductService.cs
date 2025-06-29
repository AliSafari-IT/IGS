using IGSPharma.Application.DTOs;

namespace IGSPharma.Application.Interfaces
{
    public interface IProductService
    {
        Task<PagedResponse<ProductDto>> GetAllProductsAsync(
            int page,
            int limit,
            string? category = null);
        Task<ApiResponse<ProductDto>> GetProductByIdAsync(string id);
        Task<PagedResponse<ProductDto>> SearchProductsAsync(
            string query,
            int page,
            int limit);
        Task<ApiResponse<ProductDto>> CreateProductAsync(CreateProductRequest request);
        Task<ApiResponse<ProductDto>> UpdateProductAsync(string id, UpdateProductRequest request);
        Task<ApiResponse<bool>> DeleteProductAsync(string id);
    }
}
