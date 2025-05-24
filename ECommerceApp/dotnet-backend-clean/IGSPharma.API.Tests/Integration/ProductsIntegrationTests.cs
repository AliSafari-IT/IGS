using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using FluentAssertions;
using IGSPharma.API.Tests.Helpers;
using IGSPharma.Application.DTOs;
using Xunit;

namespace IGSPharma.API.Tests.Integration
{
    public class ProductsIntegrationTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly CustomWebApplicationFactory _factory;
        private readonly HttpClient _client;

        public ProductsIntegrationTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = _factory.CreateClient();
        }

        [Fact]
        public async Task GetProducts_ReturnsSuccessAndProducts()
        {
            // Act
            var response = await _client.GetAsync("/api/products");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var content = await response.Content.ReadFromJsonAsync<PagedResponse<ProductDto>>();
            content.Should().NotBeNull();
            content!.Success.Should().BeTrue();
            content.Data.Should().NotBeNull();
            content.Data.Should().HaveCountGreaterThan(0);
        }

        [Fact]
        public async Task GetProductById_WithValidId_ReturnsProduct()
        {
            // First, check if products endpoint returns data
            var productsResponse = await _client.GetAsync("/api/products");
            var productsContent = await productsResponse.Content.ReadAsStringAsync();
            Console.WriteLine($"Products endpoint response: {productsResponse.StatusCode}");
            Console.WriteLine($"Products content: {productsContent}");

            // Arrange
            string validProductId = "1";

            // Act
            var response = await _client.GetAsync($"/api/products/{validProductId}");
            var responseContent = await response.Content.ReadAsStringAsync();

            // Debug info
            Console.WriteLine($"Product by ID endpoint response: {response.StatusCode}");
            Console.WriteLine($"Response content: {responseContent}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var content = await response.Content.ReadFromJsonAsync<ApiResponse<ProductDto>>();
            content.Should().NotBeNull();
            content!.Success.Should().BeTrue();
            content.Data.Should().NotBeNull();
            content.Data!.Id.Should().Be(validProductId);
        }

        [Fact]
        public async Task GetProductById_WithInvalidId_ReturnsNotFound()
        {
            // Arrange
            string invalidProductId = "999";

            // Act
            var response = await _client.GetAsync($"/api/products/{invalidProductId}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.NotFound);

            var content = await response.Content.ReadFromJsonAsync<ApiResponse<ProductDto>>();
            content.Should().NotBeNull();
            content!.Success.Should().BeFalse();
            content.Data.Should().BeNull();
        }

        [Fact]
        public async Task SearchProducts_ReturnsMatchingProducts()
        {
            // Arrange
            string searchQuery = "Test";

            // Act
            var response = await _client.GetAsync($"/api/products/search?query={searchQuery}");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var content = await response.Content.ReadFromJsonAsync<PagedResponse<ProductDto>>();
            content.Should().NotBeNull();
            content!.Success.Should().BeTrue();
            content.Data.Should().NotBeNull();
        }
    }
}
