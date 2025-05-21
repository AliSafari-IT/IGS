using System.Collections.Generic;
using System.Threading.Tasks;
using IGSPharma.Domain.Entities;

namespace IGSPharma.Domain.Repositories
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(string id);
        Task<User> GetByEmailAsync(string email);
        Task<IEnumerable<User>> GetAllAsync();
        Task<User> CreateAsync(User user);
        Task<User> UpdateAsync(User user);
        Task<bool> DeleteAsync(string id);
        Task<bool> EmailExistsAsync(string email);
        Task<bool> ValidateCredentialsAsync(string email, string password);
    }
}
