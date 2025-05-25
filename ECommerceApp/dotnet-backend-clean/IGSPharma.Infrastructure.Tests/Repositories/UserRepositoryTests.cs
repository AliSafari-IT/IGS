using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IGSPharma.Domain.Entities;
using IGSPharma.Infrastructure.Data;
using IGSPharma.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Xunit;
using Moq;
using BC = BCrypt.Net.BCrypt;

namespace IGSPharma.Infrastructure.Tests.Repositories
{
    public class UserRepositoryTests : IDisposable
    {
        private readonly DbContextOptions<ApplicationDbContext> _dbContextOptions;
        private readonly ApplicationDbContext _dbContext;
        private readonly UserRepository _userRepository;

        public UserRepositoryTests()
        {
            // Use in-memory database for testing
            _dbContextOptions = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _dbContext = new ApplicationDbContext(_dbContextOptions);
            _userRepository = new UserRepository(_dbContext);

            // Seed the database with test data
            SeedDatabase();
        }

        public void Dispose()
        {
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
        }

        private void SeedDatabase()
        {
            // Add test users
            var users = new List<User>
            {
                new User
                {
                    Id = "user1",
                    Email = "test1@example.com",
                    FirstName = "Test",
                    LastName = "User1",
                    PhoneNumber = "+1234567890",
                    PasswordHash = BC.HashPassword("Password123!"),
                    CreatedAt = DateTime.UtcNow,
                    Role = "customer"
                },
                new User
                {
                    Id = "user2",
                    Email = "test2@example.com",
                    FirstName = "Test",
                    LastName = "User2",
                    PhoneNumber = "+1987654321",
                    PasswordHash = BC.HashPassword("Password123!"),
                    CreatedAt = DateTime.UtcNow,
                    Role = "admin"
                }
            };

            _dbContext.Users.AddRange(users);
            _dbContext.SaveChanges();
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnUser_WhenUserExists()
        {
            // Act
            var result = await _userRepository.GetByIdAsync("user1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("user1", result.Id);
            Assert.Equal("test1@example.com", result.Email);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Act
            var result = await _userRepository.GetByIdAsync("nonexistent");

            // Assert
            Assert.Null(result);
        }


        [Theory]
        [InlineData("test1@example.com", true)]
        [InlineData("TEST1@example.com", true)] // Test case insensitivity
        [InlineData("nonexistent@example.com", false)]
        public async Task GetByEmailAsync_ShouldReturnExpectedResult(string email, bool shouldExist)
        {
            // Act
            var result = await _userRepository.GetByEmailAsync(email);

            // Assert
            if (shouldExist)
            {
                Assert.NotNull(result);
                Assert.Equal(email.ToLower(), result.Email.ToLower());
            }
            else
            {
                Assert.Null(result);
            }
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllUsers()
        {
            // Act
            var result = await _userRepository.GetAllAsync();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task CreateAsync_ShouldAddNewUser()
        {
            // Arrange
            var newUser = new User
            {
                Id = "user3",
                Email = "test3@example.com",
                FirstName = "Test",
                LastName = "User3",
                PhoneNumber = "+1122334455",
                PasswordHash = "plaintextpassword",
                Role = "customer"
            };

            // Act
            var result = await _userRepository.CreateAsync(newUser);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("user3", result.Id);
            Assert.StartsWith("$2a$", result.PasswordHash); // Password should be hashed
            
            // Verify the user was added to the database
            var userInDb = await _dbContext.Users.FindAsync("user3");
            Assert.NotNull(userInDb);
            Assert.Equal("test3@example.com", userInDb.Email);
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateExistingUser()
        {
            // Arrange
            var user = await _userRepository.GetByIdAsync("user1");
            user.FirstName = "Updated";
            user.LastName = "Name";

            // Act
            var result = await _userRepository.UpdateAsync(user);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("Updated", result.FirstName);
            Assert.Equal("Name", result.LastName);
            
            // Verify changes were saved to the database
            var updatedUser = await _userRepository.GetByIdAsync("user1");
            Assert.Equal("Updated", updatedUser.FirstName);
        }

        [Fact]
        public async Task UpdateAsync_ShouldHashPassword_WhenPasswordIsUpdated()
        {
            // Arrange
            var user = await _userRepository.GetByIdAsync("user1");
            var originalHash = user.PasswordHash;
            user.PasswordHash = "newpassword";

            // Act
            var result = await _userRepository.UpdateAsync(user);

            // Assert
            Assert.NotNull(result);
            Assert.NotEqual("newpassword", result.PasswordHash);
            Assert.StartsWith("$2a$", result.PasswordHash);
            Assert.NotEqual(originalHash, result.PasswordHash);
        }

        [Fact]
        public async Task DeleteAsync_ShouldRemoveUser()
        {
            // Act
            var result = await _userRepository.DeleteAsync("user1");

            // Assert
            Assert.True(result);
            
            // Verify user was removed
            var deletedUser = await _userRepository.GetByIdAsync("user1");
            Assert.Null(deletedUser);
        }

        [Fact]
        public async Task DeleteAsync_ShouldReturnFalse_WhenUserDoesNotExist()
        {
            // Act
            var result = await _userRepository.DeleteAsync("nonexistent");

            // Assert
            Assert.False(result);
        }

        [Theory]
        [InlineData("test1@example.com", true)]
        [InlineData("TEST1@example.com", true)] // Test case insensitivity
        [InlineData("nonexistent@example.com", false)]
        public async Task EmailExistsAsync_ShouldReturnExpectedResult(string email, bool expectedResult)
        {
            // Act
            var result = await _userRepository.EmailExistsAsync(email);

            // Assert
            Assert.Equal(expectedResult, result);
        }

        [Theory]
        [InlineData("test1@example.com", "Password123!", true)]
        [InlineData("TEST1@example.com", "Password123!", true)] // Test case insensitivity
        [InlineData("test1@example.com", "wrongpassword", false)]
        [InlineData("nonexistent@example.com", "Password123!", false)]
        public async Task ValidateCredentialsAsync_ShouldReturnExpectedResult(string email, string password, bool expectedResult)
        {
            // Act
            var result = await _userRepository.ValidateCredentialsAsync(email, password);

            // Assert
            Assert.Equal(expectedResult, result);
        }
    }
}
