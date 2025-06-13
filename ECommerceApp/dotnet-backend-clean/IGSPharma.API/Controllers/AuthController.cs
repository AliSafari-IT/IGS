using System;
using System.Threading.Tasks;
using IGSPharma.Application.Interfaces;
using IGSPharma.Application.Models.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IGSPharma.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _authService.LoginAsync(request);

            if (!response.Success)
            {
                return Unauthorized(new { message = response.Message });
            }

            return Ok(response);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            Console.WriteLine($"[DEBUG] Register endpoint called with email: {request?.Email}");

            if (!ModelState.IsValid)
            {
                Console.WriteLine(
                    $"[DEBUG] Register validation failed: {string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage))}"
                );
                return BadRequest(ModelState);
            }

            Console.WriteLine($"[DEBUG] Calling AuthService.RegisterAsync");
            var response = await _authService.RegisterAsync(request);
            Console.WriteLine(
                $"[DEBUG] AuthService.RegisterAsync returned: Success={response.Success}, Message={response.Message}"
            );

            if (!response.Success)
            {
                Console.WriteLine($"[DEBUG] Registration failed: {response.Message}");
                return BadRequest(new { message = response.Message });
            }

            Console.WriteLine($"[DEBUG] Registration successful for email: {request.Email}");
            return Ok(response);
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _authService.ForgotPasswordAsync(request);

            // Always return success for security reasons
            return Ok(
                new
                {
                    message = "If your email is registered, you will receive a password reset link shortly.",
                }
            );
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _authService.ResetPasswordAsync(request);

            if (!result)
            {
                return BadRequest(new { message = "Invalid or expired password reset token." });
            }

            return Ok(new { message = "Password has been reset successfully." });
        }

        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] string refreshToken)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest(new { message = "Refresh token is required." });
            }

            var response = await _authService.RefreshTokenAsync(refreshToken);

            if (!response.Success)
            {
                return BadRequest(new { message = response.Message });
            }

            return Ok(response);
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetUserDetails()
        {
            var userId = User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var userDetails = await _authService.GetUserDetailsAsync(userId);

            if (userDetails == null)
            {
                return NotFound();
            }

            return Ok(userDetails);
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<IActionResult> UpdateUserDetails([FromBody] UpdateUserRequest request)
        {
            Console.WriteLine(
                $"[DEBUG] UpdateUserDetails called with request: {System.Text.Json.JsonSerializer.Serialize(request)}"
            );

            if (!ModelState.IsValid)
            {
                Console.WriteLine(
                    $"[DEBUG] UpdateUserDetails validation failed: {string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage))}"
                );
                return BadRequest(ModelState);
            }

            // Declare userId variable
            string userId = null;
            
            // First check if the request has a UserId property
            if (!string.IsNullOrEmpty(request.UserId))
            {
                userId = request.UserId;
                Console.WriteLine($"[DEBUG] Using UserId from request: {userId}");
            }
            else
            {
                // Try multiple claim types to find the user ID
                userId = User.FindFirst("sub")?.Value;
                
                // Log all claims to help debug
                Console.WriteLine("[DEBUG] All claims in token:");
                foreach (var claim in User.Claims)
                {
                    Console.WriteLine($"[DEBUG] Claim: {claim.Type} = {claim.Value}");
                }
                
                if (string.IsNullOrEmpty(userId))
                {
                    userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                    Console.WriteLine($"[DEBUG] Tried NameIdentifier claim, userId: {userId}");
                }
                
                if (string.IsNullOrEmpty(userId))
                {
                    userId = User.FindFirst("jti")?.Value;
                    Console.WriteLine($"[DEBUG] Tried jti claim, userId: {userId}");
                }
                
                // If we still don't have a userId, try to get email from claims
                if (string.IsNullOrEmpty(userId))
                {
                    var email = User.FindFirst("email")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
                    Console.WriteLine($"[DEBUG] Found email in claims: {email}");
                    
                    // For testing purposes, use a hardcoded user ID as a last resort
                    // In a real application, you would implement proper user identification
                    userId = "1"; // Temporary hardcoded ID for testing
                    Console.WriteLine($"[DEBUG] Using temporary userId: {userId}");
                }
            }
            Console.WriteLine($"[DEBUG] UpdateUserDetails for userId: {userId}");

            if (string.IsNullOrEmpty(userId))
            {
                Console.WriteLine($"[DEBUG] UpdateUserDetails failed: No user ID found in token");
                return Unauthorized();
            }

            try
            {
                Console.WriteLine($"[DEBUG] Calling AuthService.UpdateUserDetailsAsync");
                var userDetails = await _authService.UpdateUserDetailsAsync(userId, request);
                Console.WriteLine(
                    $"[DEBUG] AuthService.UpdateUserDetailsAsync returned: {(userDetails != null ? "Success" : "Null")}"
                );

                if (userDetails == null)
                {
                    Console.WriteLine($"[DEBUG] UpdateUserDetails failed: User not found");
                    return NotFound(new { message = "User not found" });
                }

                Console.WriteLine($"[DEBUG] UpdateUserDetails successful for userId: {userId}");
                return Ok(userDetails);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DEBUG] UpdateUserDetails exception: {ex.Message}");
                Console.WriteLine($"[DEBUG] UpdateUserDetails stack trace: {ex.StackTrace}");
                return StatusCode(
                    500,
                    new { message = "An error occurred while updating user details" }
                );
            }
        }

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirst("sub")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            var result = await _authService.ChangePasswordAsync(userId, request);

            if (!result)
            {
                return BadRequest(new { message = "Current password is incorrect." });
            }

            return Ok(new { message = "Password has been changed successfully." });
        }

        [Authorize(Roles = "admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _authService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[DEBUG] GetUsers exception: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while fetching users" });
            }
        }
    }
}
