using System.Security.Claims;
using IGSPharma.Domain.Entities;

namespace IGSPharma.Core.Interfaces
{
    public interface IJwtService
    {
        string GenerateToken(User user);
        ClaimsPrincipal ValidateToken(string token);
    }
}
