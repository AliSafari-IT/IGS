using System.Collections.Generic;
using System.Threading.Tasks;
using IGSPharma.Application.Models.Auth;

namespace IGSPharma.Application.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> LoginAsync(LoginRequest request);
        Task<AuthResponse> RegisterAsync(RegisterRequest request);
        Task<bool> ForgotPasswordAsync(ForgotPasswordRequest request);
        Task<bool> ResetPasswordAsync(ResetPasswordRequest request);
        Task<AuthResponse> RefreshTokenAsync(string refreshToken);
        Task<UserDetailsResponse> GetUserDetailsAsync(string userId);
        Task<UserDetailsResponse> UpdateUserDetailsAsync(string userId, UpdateUserRequest request);
        Task<bool> ChangePasswordAsync(string userId, ChangePasswordRequest request);
        Task<List<UserDetailsResponse>> GetAllUsersAsync();
    }
}
