using System;
using System.Threading.Tasks;
using IGSPharma.Application.Interfaces;
using IGSPharma.Application.Models.Auth;
using IGSPharma.Core.Interfaces;
using IGSPharma.Domain.Entities;
using IGSPharma.Domain.Repositories;
using BC = BCrypt.Net.BCrypt;

namespace IGSPharma.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtService _jwtService;

        public AuthService(IUserRepository userRepository, IJwtService jwtService)
        {
            _userRepository = userRepository;
            _jwtService = jwtService;
        }

        public async Task<AuthResponse> LoginAsync(LoginRequest request)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(request.Email);

            // Check if user exists
            if (user == null)
            {
                return new AuthResponse { Success = false, Message = "Invalid email or password" };
            }

            // Verify password
            if (!BC.Verify(request.Password, user.PasswordHash))
            {
                return new AuthResponse { Success = false, Message = "Invalid email or password" };
            }

            // Update last login time
            user.LastLoginAt = DateTime.UtcNow;
            await _userRepository.UpdateAsync(user);

            // Generate JWT token
            var token = _jwtService.GenerateToken(user);

            // Generate refresh token (in a real app, you'd store this securely)
            var refreshToken = Guid.NewGuid().ToString();

            // Return successful response
            return new AuthResponse
            {
                Success = true,
                Message = "Login successful",
                Token = token,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(60), // Match JWT expiry
                User = MapUserToUserDetailsResponse(user),
            };
        }

        public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
        {
            Console.WriteLine(
                $"[DEBUG] AuthService.RegisterAsync called with email: {request.Email}"
            );

            string token = null;
            string refreshToken = null;
            User createdUser = null;

            try
            {
                // Check if email already exists
                Console.WriteLine($"[DEBUG] Checking if email already exists: {request.Email}");
                var existingUser = await _userRepository.GetByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    Console.WriteLine($"[DEBUG] Email already registered: {request.Email}");
                    return new AuthResponse
                    {
                        Success = false,
                        Message = "Email already registered",
                    };
                }

                // Create new user
                Console.WriteLine($"[DEBUG] Creating new user with email: {request.Email}");
                var user = new User
                {
                    Email = request.Email,
                    PasswordHash = BC.HashPassword(request.Password),
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    PhoneNumber = request.PhoneNumber,
                    Role = "customer", // Default role
                    PrescriptionAccess = false, // Default access
                    CreatedAt = DateTime.UtcNow,
                };

                // Save user to database
                Console.WriteLine($"[DEBUG] Saving user to database: {request.Email}");
                createdUser = await _userRepository.CreateAsync(user);
                Console.WriteLine($"[DEBUG] User created with ID: {createdUser?.Id ?? "null"}");

                // Generate JWT token
                Console.WriteLine($"[DEBUG] Generating JWT token");
                token = _jwtService.GenerateToken(createdUser);
                Console.WriteLine(
                    $"[DEBUG] JWT token generated: {(token != null ? "success" : "failed")}"
                );

                // Generate refresh token
                refreshToken = Guid.NewGuid().ToString();
                Console.WriteLine($"[DEBUG] Refresh token generated");

                // Return successful response
                Console.WriteLine($"[DEBUG] Returning successful response");
                return new AuthResponse
                {
                    Success = true,
                    Message = "Registration successful",
                    Token = token,
                    RefreshToken = refreshToken,
                    Expiration = DateTime.UtcNow.AddMinutes(60), // Match JWT expiry
                    User = MapUserToUserDetailsResponse(createdUser),
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[ERROR] Exception in RegisterAsync: {ex.Message}");
                Console.WriteLine($"[ERROR] Stack trace: {ex.StackTrace}");
                return new AuthResponse
                {
                    Success = false,
                    Message = "An error occurred during registration",
                };
            }

            // This code should never be reached, but adding as a fallback
            return new AuthResponse
            {
                Success = true,
                Message = "Registration successful",
                Token = token,
                RefreshToken = refreshToken,
                Expiration = DateTime.UtcNow.AddMinutes(60), // Match JWT expiry
                User = MapUserToUserDetailsResponse(createdUser),
            };
        }

        public async Task<bool> ForgotPasswordAsync(ForgotPasswordRequest request)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(request.Email);

            // If user doesn't exist, still return true for security reasons
            if (user == null)
            {
                return true;
            }

            // Generate password reset token
            var resetToken = Guid.NewGuid().ToString();
            user.ResetPasswordToken = resetToken;
            user.ResetPasswordTokenExpiry = DateTime.UtcNow.AddHours(24); // Token valid for 24 hours

            // Update user with reset token
            await _userRepository.UpdateAsync(user);

            // In a real app, you would send an email with the reset link
            // For this example, we'll just return true

            return true;
        }

        public async Task<bool> ResetPasswordAsync(ResetPasswordRequest request)
        {
            // Find user by email
            var user = await _userRepository.GetByEmailAsync(request.Email);

            // Check if user exists and token is valid
            if (
                user == null
                || user.ResetPasswordToken != request.Token
                || user.ResetPasswordTokenExpiry < DateTime.UtcNow
            )
            {
                return false;
            }

            // Update password
            user.PasswordHash = BC.HashPassword(request.NewPassword);
            user.ResetPasswordToken = null;
            user.ResetPasswordTokenExpiry = null;

            // Save changes
            await _userRepository.UpdateAsync(user);

            return true;
        }

        public async Task<AuthResponse> RefreshTokenAsync(string refreshToken)
        {
            // In a real app, you would validate the refresh token against stored tokens
            // For this example, we'll just generate a new token

            // This is a placeholder implementation
            // In a real app, you would retrieve the user associated with this refresh token

            return new AuthResponse
            {
                Success = false,
                Message = "Refresh token functionality not fully implemented",
            };
        }

        public async Task<UserDetailsResponse> GetUserDetailsAsync(string userId)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

            return MapUserToUserDetailsResponse(user);
        }

        public async Task<UserDetailsResponse> UpdateUserDetailsAsync(
            string userId,
            UpdateUserRequest request
        )
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return null;
            }

            // Update user details
            user.FirstName = request.FirstName;
            user.LastName = request.LastName;
            user.PhoneNumber = request.PhoneNumber;

            // Save changes
            var updatedUser = await _userRepository.UpdateAsync(user);

            return MapUserToUserDetailsResponse(updatedUser);
        }

        public async Task<bool> ChangePasswordAsync(string userId, ChangePasswordRequest request)
        {
            var user = await _userRepository.GetByIdAsync(userId);

            if (user == null)
            {
                return false;
            }

            // Verify current password
            if (!BC.Verify(request.CurrentPassword, user.PasswordHash))
            {
                return false;
            }

            // Update password
            user.PasswordHash = BC.HashPassword(request.NewPassword);

            // Save changes
            await _userRepository.UpdateAsync(user);

            return true;
        }

        private UserDetailsResponse MapUserToUserDetailsResponse(User user)
        {
            return new UserDetailsResponse
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role,
                PrescriptionAccess = user.PrescriptionAccess,
                CreatedAt = user.CreatedAt,
                LastLoginAt = user.LastLoginAt,
            };
        }
    }
}
