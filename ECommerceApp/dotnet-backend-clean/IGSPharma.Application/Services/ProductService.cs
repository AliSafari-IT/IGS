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

        public async Task<ApiResponse<ProductDto>> CreateProductAsync(CreateProductRequest request)
        {
            try
            {
                var product = new Product
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = request.Name,
                    Price = request.Price,
                    ImageUrl = request.ImageUrl,
                    Category = request.Category,
                    Description = request.Description,
                    InStock = request.InStock,
                    RequiresPrescription = request.RequiresPrescription,
                    Dosage = request.Dosage,
                    Manufacturer = request.Manufacturer
                };

                var createdProduct = await _productRepository.CreateProductAsync(product);
                var productDto = MapToDto(createdProduct);

                return new ApiResponse<ProductDto>
                {
                    Success = true,
                    Data = productDto,
                    Message = "Product created successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<ProductDto>
                {
                    Success = false,
                    Message = $"Error creating product: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<ProductDto>> UpdateProductAsync(string id, UpdateProductRequest request)
        {
            try
            {
                var existingProduct = await _productRepository.GetProductByIdAsync(id);
                if (existingProduct == null)
                {
                    return new ApiResponse<ProductDto>
                    {
                        Success = false,
                        Message = "Product not found"
                    };
                }

                // Update product properties
                existingProduct.Name = request.Name;
                existingProduct.Price = request.Price;
                existingProduct.ImageUrl = request.ImageUrl;
                existingProduct.Category = request.Category;
                existingProduct.Description = request.Description;
                existingProduct.InStock = request.InStock;
                existingProduct.RequiresPrescription = request.RequiresPrescription;
                existingProduct.Dosage = request.Dosage;
                existingProduct.Manufacturer = request.Manufacturer;

                var updatedProduct = await _productRepository.UpdateProductAsync(existingProduct);
                var productDto = MapToDto(updatedProduct);

                return new ApiResponse<ProductDto>
                {
                    Success = true,
                    Data = productDto,
                    Message = "Product updated successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<ProductDto>
                {
                    Success = false,
                    Message = $"Error updating product: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<bool>> DeleteProductAsync(string id)
        {
            try
            {
                var existingProduct = await _productRepository.GetProductByIdAsync(id);
                if (existingProduct == null)
                {
                    return new ApiResponse<bool>
                    {
                        Success = false,
                        Message = "Product not found"
                    };
                }

                var deleted = await _productRepository.DeleteProductAsync(id);
                
                return new ApiResponse<bool>
                {
                    Success = true,
                    Data = deleted,
                    Message = "Product deleted successfully"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    Message = $"Error deleting product: {ex.Message}"
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
