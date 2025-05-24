# IGS Pharma Backend Testing Guide

This document provides instructions on how to run the unit tests and best practices for testing in the IGS Pharma backend application.

## Test Structure

The test projects follow the same layered architecture as the main application:

- **IGSPharma.Domain.Tests**: Tests for domain entities, value objects, and domain logic
- **IGSPharma.Application.Tests**: Tests for application services and use cases
- **IGSPharma.Infrastructure.Tests**: Tests for repository implementations and external services
- **IGSPharma.API.Tests**: Tests for API controllers and integration tests

## Running the Tests

### Running All Tests

To run all tests in the solution, use the following command from the root directory:

```bash
dotnet test
```

### Running Tests for a Specific Project

To run tests for a specific project, use:

```bash
dotnet test IGSPharma.Domain.Tests/IGSPharma.Domain.Tests.csproj
dotnet test IGSPharma.Application.Tests/IGSPharma.Application.Tests.csproj
dotnet test IGSPharma.Infrastructure.Tests/IGSPharma.Infrastructure.Tests.csproj
dotnet test IGSPharma.API.Tests/IGSPharma.API.Tests.csproj
```

### Running a Specific Test

To run a specific test or test class, use the `--filter` option:

```bash
dotnet test --filter "FullyQualifiedName=IGSPharma.Domain.Tests.Entities.ProductTests"
```

### Running Tests with Code Coverage

To run tests with code coverage, you can use the following command:

```bash
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=cobertura
```

## Test Types

### Unit Tests

Unit tests focus on testing individual components in isolation. Dependencies are typically mocked using Moq.

Example:

```csharp
[Fact]
public async Task GetProductByIdAsync_WithValidId_ShouldReturnProduct()
{
    // Arrange
    var product = new Product { Id = "1", Name = "Aspirin" };
    _mockProductRepository.Setup(repo => repo.GetProductByIdAsync("1"))
        .ReturnsAsync(product);

    // Act
    var result = await _productService.GetProductByIdAsync("1");

    // Assert
    result.Should().NotBeNull();
    result.Success.Should().BeTrue();
    result.Data.Id.Should().Be("1");
}
```

### Integration Tests

Integration tests verify that different components work together correctly. They often use an in-memory database instead of mocks.

Example:

```csharp
[Fact]
public async Task GetProducts_ReturnsSuccessAndProducts()
{
    // Act
    var response = await _client.GetAsync("/api/products");

    // Assert
    response.EnsureSuccessStatusCode();
    var result = JsonSerializer.Deserialize<PagedResponse<ProductDto>>(
        await response.Content.ReadAsStringAsync(),
        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
    );
    result.Success.Should().BeTrue();
    result.Data.Should().NotBeEmpty();
}
```

## Best Practices

### 1. Follow the AAA Pattern

Structure your tests using the Arrange-Act-Assert pattern:

- **Arrange**: Set up the test data and conditions
- **Act**: Perform the action being tested
- **Assert**: Verify the results

### 2. Test Naming Convention

Use descriptive names that indicate:

- The method being tested
- The scenario or condition
- The expected behavior

Example: `GetProductByIdAsync_WithInvalidId_ShouldReturnNotFound`

### 3. Use FluentAssertions

FluentAssertions provides a more readable and expressive way to write assertions:

```csharp
// Instead of:
Assert.Equal("Aspirin", product.Name);
Assert.True(product.InStock);

// Use:
product.Name.Should().Be("Aspirin");
product.InStock.Should().BeTrue();
```

### 4. Mock External Dependencies

Use Moq to mock external dependencies:

```csharp
var mockRepository = new Mock<IProductRepository>();
mockRepository.Setup(repo => repo.GetProductByIdAsync("1"))
    .ReturnsAsync(new Product { Id = "1", Name = "Aspirin" });
```

### 5. Use In-Memory Database for Repository Tests

For testing repositories, use the Entity Framework Core in-memory database provider:

```csharp
var options = new DbContextOptionsBuilder<ApplicationDbContext>()
    .UseInMemoryDatabase(databaseName: "TestDatabase")
    .Options;
```

### 6. Test Edge Cases

Don't just test the happy path. Include tests for:

- Invalid inputs
- Empty collections
- Null values
- Boundary conditions

### 7. Keep Tests Independent

Each test should be independent and not rely on the state from other tests.

## Adding New Tests

When adding new features to the application, follow these steps:

1. Create a new test class in the appropriate test project
2. Write tests before implementing the feature (Test-Driven Development)
3. Ensure tests cover both success and failure scenarios
4. Run the tests to verify they fail initially
5. Implement the feature until all tests pass

## Continuous Integration

The tests are automatically run as part of the CI/CD pipeline. Make sure all tests pass before submitting a pull request.

## Troubleshooting

### Common Issues

1. **Tests failing with database errors**: Ensure you're using the in-memory database for tests
2. **Mocked methods not being called**: Verify your mock setup is correct
3. **Integration tests failing**: Check if the API endpoints or request format has changed

### Getting Help

If you encounter issues with the tests, contact the development team for assistance.
