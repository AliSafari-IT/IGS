using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using IGSPharma.API.Controllers;
using IGSPharma.Application.DTOs;
using IGSPharma.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace IGSPharma.API.Tests.Controllers
{
    public class ProductsControllerTests
    {
        private readonly Mock<IProductService> _mockProductService;
        private readonly Mock<ILogger<ProductsController>> _mockLogger;
        private readonly ProductsController _controller;

        public ProductsControllerTests()
        {
            _mockProductService = new Mock<IProductService>();
            _mockLogger = new Mock<ILogger<ProductsController>>();
            _controller = new ProductsController(_mockProductService.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetProducts_ShouldReturnOkWithProducts()
        {
            // Arrange
            var pagedResponse = new PagedResponse<ProductDto>
            {
                Data = new List<ProductDto>
                {
                    new ProductDto
                    {
                        Id = "1",
                        Name = "Aspirin",
                        Price = 5.99m,
                    },
                    new ProductDto
                    {
                        Id = "2",
                        Name = "Ibuprofen",
                        Price = 7.99m,
                    },
                },
                Page = 1,
                Count = 2,
                TotalPages = 1,
                Success = true,
            };

            _mockProductService
                .Setup(service =>
                    service.GetAllProductsAsync(
                        It.IsAny<int>(),
                        It.IsAny<int>(),
                        It.IsAny<string>()
                    )
                )
                .ReturnsAsync(pagedResponse);

            // Act
            var result = await _controller.GetProducts(category: null, page: 1, limit: 10);

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            var returnValue = okResult
                .Value.Should()
                .BeAssignableTo<PagedResponse<ProductDto>>()
                .Subject;

            returnValue.Data.Should().HaveCount(2);
            returnValue.Success.Should().BeTrue();
            returnValue.Page.Should().Be(1);
            returnValue.Count.Should().Be(2);
        }

        [Fact]
        public async Task GetProductById_WithValidId_ShouldReturnOkWithProduct()
        {
            // Arrange
            var productResponse = new ApiResponse<ProductDto>
            {
                Data = new ProductDto
                {
                    Id = "1",
                    Name = "Aspirin",
                    Price = 5.99m,
                    Category = "Pain Relief",
                    Description = "Pain relief medication",
                },
                Success = true,
            };

            _mockProductService
                .Setup(service => service.GetProductByIdAsync("1"))
                .ReturnsAsync(productResponse);

            // Act
            var result = await _controller.GetProduct("1");

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            var returnValue = okResult
                .Value.Should()
                .BeAssignableTo<ApiResponse<ProductDto>>()
                .Subject;

            returnValue.Success.Should().BeTrue();
            returnValue.Data.Should().NotBeNull();
            returnValue.Data.Id.Should().Be("1");
            returnValue.Data.Name.Should().Be("Aspirin");
        }

        [Fact]
        public async Task GetProductById_WithInvalidId_ShouldReturnNotFound()
        {
            // Arrange
            var productResponse = new ApiResponse<ProductDto>
            {
                Data = null,
                Success = false,
                Message = "Product not found",
            };

            _mockProductService
                .Setup(service => service.GetProductByIdAsync("999"))
                .ReturnsAsync(productResponse);

            // Act
            var result = await _controller.GetProduct("999");

            // Assert
            var notFoundResult = result.Result.Should().BeOfType<NotFoundObjectResult>().Subject;
            var returnValue = notFoundResult
                .Value.Should()
                .BeAssignableTo<ApiResponse<ProductDto>>()
                .Subject;

            returnValue.Success.Should().BeFalse();
            returnValue.Data.Should().BeNull();
            returnValue.Message.Should().Contain("not found");
        }

        [Fact]
        public async Task SearchProducts_ShouldReturnOkWithMatchingProducts()
        {
            // Arrange
            var pagedResponse = new PagedResponse<ProductDto>
            {
                Data = new List<ProductDto>
                {
                    new ProductDto
                    {
                        Id = "1",
                        Name = "Aspirin",
                        Price = 5.99m,
                    },
                    new ProductDto
                    {
                        Id = "2",
                        Name = "Aspirin Plus",
                        Price = 7.99m,
                    },
                },
                Page = 1,
                Count = 2,
                TotalPages = 1,
                Success = true,
            };

            _mockProductService
                .Setup(service =>
                    service.SearchProductsAsync("Aspirin", It.IsAny<int>(), It.IsAny<int>())
                )
                .ReturnsAsync(pagedResponse);

            // Act
            var result = await _controller.SearchProducts("Aspirin", page: 1, limit: 10);

            // Assert
            var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
            var returnValue = okResult
                .Value.Should()
                .BeAssignableTo<PagedResponse<ProductDto>>()
                .Subject;

            returnValue.Data.Should().HaveCount(2);
            returnValue.Success.Should().BeTrue();
            returnValue.Page.Should().Be(1);
            returnValue.Count.Should().Be(2);
        }
    }
}
