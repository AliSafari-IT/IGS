using Xunit;
using FluentAssertions;
using IGSPharma.Domain.Entities;

namespace IGSPharma.Domain.Tests.Entities
{
    public class ProductTests
    {
        [Fact]
        public void Product_ShouldHaveCorrectProperties()
        {
            // Arrange
            var product = new Product
            {
                Id = "prod-123",
                Name = "Aspirin",
                Price = 5.99m,
                ImageUrl = "https://example.com/aspirin.jpg",
                Category = "Pain Relief",
                Description = "Pain relief medication",
                InStock = true,
                RequiresPrescription = false,
                Dosage = "500mg",
                Manufacturer = "Bayer"
            };

            // Assert
            product.Id.Should().Be("prod-123");
            product.Name.Should().Be("Aspirin");
            product.Price.Should().Be(5.99m);
            product.ImageUrl.Should().Be("https://example.com/aspirin.jpg");
            product.Category.Should().Be("Pain Relief");
            product.Description.Should().Be("Pain relief medication");
            product.InStock.Should().BeTrue();
            product.RequiresPrescription.Should().BeFalse();
            product.Dosage.Should().Be("500mg");
            product.Manufacturer.Should().Be("Bayer");
        }

        [Fact]
        public void Product_DefaultValues_ShouldBeCorrect()
        {
            // Arrange
            var product = new Product();

            // Assert
            product.Id.Should().BeEmpty();
            product.Name.Should().BeEmpty();
            product.Price.Should().Be(0);
            product.ImageUrl.Should().BeEmpty();
            product.Category.Should().BeEmpty();
            product.Description.Should().BeNull();
            product.InStock.Should().BeTrue(); // Default value is true
            product.RequiresPrescription.Should().BeFalse(); // Default value is false
            product.Dosage.Should().BeNull();
            product.Manufacturer.Should().BeNull();
        }
    }
}
