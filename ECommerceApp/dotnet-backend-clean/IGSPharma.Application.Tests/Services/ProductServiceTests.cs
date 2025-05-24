using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using IGSPharma.Application.DTOs;
using IGSPharma.Application.Services;
using IGSPharma.Domain.Entities;
using IGSPharma.Domain.Interfaces;
using Moq;
using Xunit;

namespace IGSPharma.Application.Tests.Services
{
    public class ProductServiceTests
    {
        private readonly Mock<IProductRepository> _mockProductRepository;
        private readonly ProductService _productService;

        public ProductServiceTests()
        {
            _mockProductRepository = new Mock<IProductRepository>();
            _productService = new ProductService(_mockProductRepository.Object);
        }

        [Fact]
        public async Task GetAllProductsAsync_ShouldReturnPagedResponse()
        {
            // Arrange
            var products = new List<Product>
            {
                new Product
                {
                    Id = "1",
                    Name = "Product 1",
                    Price = 10.99m,
                    Category = "Category A",
                },
                new Product
                {
                    Id = "2",
                    Name = "Product 2",
                    Price = 20.99m,
                    Category = "Category A",
                },
                new Product
                {
                    Id = "3",
                    Name = "Product 3",
                    Price = 30.99m,
                    Category = "Category B",
                },
                new Product
                {
                    Id = "4",
                    Name = "Product 4",
                    Price = 40.99m,
                    Category = "Category B",
                },
                new Product
                {
                    Id = "5",
                    Name = "Product 5",
                    Price = 50.99m,
                    Category = "Category C",
                },
            };

            _mockProductRepository.Setup(repo => repo.GetAllProductsAsync()).ReturnsAsync(products);

            // Act
            var result = await _productService.GetAllProductsAsync(page: 1, limit: 2);

            // Assert
            result.Should().NotBeNull();
            result.Data.Should().NotBeNull();
            result.Data.Should().HaveCount(2);
            result.Count.Should().Be(5);
            result.TotalPages.Should().Be(3);
            result.Page.Should().Be(1);
            // No direct PageSize property in PagedResponse, so we'll check the Data count instead
            result.Data.Should().HaveCount(2);
        }

        [Fact]
        public async Task GetAllProductsAsync_WithCategory_ShouldReturnFilteredProducts()
        {
            // Arrange
            var categoryAProducts = new List<Product>
            {
                new Product
                {
                    Id = "1",
                    Name = "Product 1",
                    Price = 10.99m,
                    Category = "Category A",
                },
                new Product
                {
                    Id = "2",
                    Name = "Product 2",
                    Price = 20.99m,
                    Category = "Category A",
                },
            };

            _mockProductRepository
                .Setup(repo => repo.GetProductsByCategoryAsync("Category A"))
                .ReturnsAsync(categoryAProducts);

            // Act
            var result = await _productService.GetAllProductsAsync(
                page: 1,
                limit: 10,
                category: "Category A"
            );

            // Assert
            result.Should().NotBeNull();
            result.Data.Should().NotBeNull();
            result.Data.Should().HaveCount(2);
            result.Count.Should().Be(2);
            result.TotalPages.Should().Be(1);
            result.Page.Should().Be(1);

            result.Data.Should().AllSatisfy(p => p.Category.Should().Be("Category A"));
        }

        [Fact]
        public async Task GetProductByIdAsync_WithValidId_ShouldReturnProduct()
        {
            // Arrange
            var product = new Product
            {
                Id = "1",
                Name = "Aspirin",
                Price = 5.99m,
                Category = "Pain Relief",
                Description = "Pain relief medication",
            };

            _mockProductRepository
                .Setup(repo => repo.GetProductByIdAsync("1"))
                .ReturnsAsync(product);

            // Act
            var result = await _productService.GetProductByIdAsync("1");

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeTrue();
            result.Data.Should().NotBeNull();
            result.Data.Id.Should().Be("1");
            result.Data.Name.Should().Be("Aspirin");
            result.Data.Price.Should().Be(5.99m);
            result.Data.Category.Should().Be("Pain Relief");
            result.Data.Description.Should().Be("Pain relief medication");
        }

        [Fact]
        public async Task GetProductByIdAsync_WithInvalidId_ShouldReturnNotFound()
        {
            // Arrange
            _mockProductRepository
                .Setup(repo => repo.GetProductByIdAsync("999"))
                .ReturnsAsync((Product)null);

            // Act
            var result = await _productService.GetProductByIdAsync("999");

            // Assert
            result.Should().NotBeNull();
            result.Success.Should().BeFalse();
            result.Data.Should().BeNull();
            result.Message.Should().Contain("not found");
        }

        [Fact]
        public async Task SearchProductsAsync_ShouldReturnMatchingProducts()
        {
            // Arrange
            var searchResults = new List<Product>
            {
                new Product
                {
                    Id = "1",
                    Name = "Aspirin",
                    Price = 5.99m,
                    Category = "Pain Relief",
                },
                new Product
                {
                    Id = "2",
                    Name = "Aspirin Plus",
                    Price = 7.99m,
                    Category = "Pain Relief",
                },
            };

            _mockProductRepository
                .Setup(repo => repo.SearchProductsAsync("Aspirin"))
                .ReturnsAsync(searchResults);

            // Act
            var result = await _productService.SearchProductsAsync("Aspirin", page: 1, limit: 10);

            // Assert
            result.Should().NotBeNull();
            result.Data.Should().NotBeNull();
            result.Data.Should().HaveCount(2);
            result.Count.Should().Be(2);
            result.Data.Should().AllSatisfy(p => p.Name.Should().Contain("Aspirin"));
        }
    }
}
