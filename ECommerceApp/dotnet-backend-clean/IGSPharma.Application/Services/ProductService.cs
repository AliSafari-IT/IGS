using IGSPharma.Application.DTOs;
using IGSPharma.Application.Interfaces;
using IGSPharma.Domain.Entities;
using IGSPharma.Domain.Interfaces;

namespace IGSPharma.Application.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _productRepository;

        public ProductService(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        public async Task<PagedResponse<ProductDto>> GetAllProductsAsync(int page, int limit, string? category = null)
        {
            try
            {
                IEnumerable<Product> products;
                
                if (string.IsNullOrEmpty(category))
                {
                    products = await _productRepository.GetAllProductsAsync();
                }
                else
                {
                    products = await _productRepository.GetProductsByCategoryAsync(category);
                }

                var totalCount = products.Count();
                var totalPages = (int)Math.Ceiling((double)totalCount / limit);
                
                // Apply pagination
                var paginatedProducts = products
                    .Skip((page - 1) * limit)
                    .Take(limit);

                // Map to DTOs
                var productDtos = paginatedProducts.Select(MapToDto).ToList();

                return new PagedResponse<ProductDto>
                {
                    Success = true,
                    Data = productDtos,
                    Count = totalCount,
                    Page = page,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                return new PagedResponse<ProductDto>
                {
                    Success = false,
                    Message = $"Error retrieving products: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<ProductDto>> GetProductByIdAsync(string id)
        {
            try
            {
                var product = await _productRepository.GetProductByIdAsync(id);

                if (product == null)
                {
                    return new ApiResponse<ProductDto>
                    {
                        Success = false,
                        Message = "Product not found"
                    };
                }

                return new ApiResponse<ProductDto>
                {
                    Success = true,
                    Data = MapToDto(product)
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<ProductDto>
                {
                    Success = false,
                    Message = $"Error retrieving product: {ex.Message}"
                };
            }
        }

        public async Task<PagedResponse<ProductDto>> SearchProductsAsync(string query, int page, int limit)
        {
            try
            {
                if (string.IsNullOrEmpty(query))
                {
                    return new PagedResponse<ProductDto>
                    {
                        Success = false,
                        Message = "Search query is required"
                    };
                }

                var products = await _productRepository.SearchProductsAsync(query);
                var totalCount = products.Count();
                var totalPages = (int)Math.Ceiling((double)totalCount / limit);
                
                // Apply pagination
                var paginatedProducts = products
                    .Skip((page - 1) * limit)
                    .Take(limit);

                // Map to DTOs
                var productDtos = paginatedProducts.Select(MapToDto).ToList();

                return new PagedResponse<ProductDto>
                {
                    Success = true,
                    Data = productDtos,
                    Count = totalCount,
                    Page = page,
                    TotalPages = totalPages
                };
            }
            catch (Exception ex)
            {
                return new PagedResponse<ProductDto>
                {
                    Success = false,
                    Message = $"Error searching products: {ex.Message}"
                };
            }
        }

        private static ProductDto MapToDto(Product product)
        {
            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                Category = product.Category,
                Description = product.Description,
                InStock = product.InStock,
                RequiresPrescription = product.RequiresPrescription,
                Dosage = product.Dosage,
                Manufacturer = product.Manufacturer
            };
        }
    }
}
