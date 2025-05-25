using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IGSPharma.Domain.Entities;
using IGSPharma.Domain.Repositories;
using IGSPharma.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using BC = BCrypt.Net.BCrypt;

namespace IGSPharma.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<User> GetByIdAsync(string id)
        {
            return await _context
                .Users.Include(u => u.Addresses)
                .FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User> GetByEmailAsync(string email)
        {
            var normalizedEmail = email.ToLower();
            return await _context
                .Users.Include(u => u.Addresses)
                .FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail);
        }

        public async Task<IEnumerable<User>> GetAllAsync()
        {
            return await _context.Users.ToListAsync();
        }

        public async Task<User> CreateAsync(User user)
        {
            // Hash the password before storing
            if (!string.IsNullOrEmpty(user.PasswordHash) && !user.PasswordHash.StartsWith("$2a$"))
            {
                user.PasswordHash = BC.HashPassword(user.PasswordHash);
            }

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<User> UpdateAsync(User user)
        {
            // If password is being updated, hash it
            if (!string.IsNullOrEmpty(user.PasswordHash) && !user.PasswordHash.StartsWith("$2a$"))
            {
                user.PasswordHash = BC.HashPassword(user.PasswordHash);
            }

            _context.Users.Update(user);
            await _context.SaveChangesAsync();
            return user;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
                return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> EmailExistsAsync(string email)
        {
            var normalizedEmail = email.ToLower();
            return await _context.Users.AnyAsync(u => u.Email.ToLower() == normalizedEmail);
        }

        public async Task<bool> ValidateCredentialsAsync(string email, string password)
        {
            var normalizedEmail = email.ToLower();
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Email.ToLower() == normalizedEmail
            );
            if (user == null)
                return false;

            return BC.Verify(password, user.PasswordHash);
        }
    }
}
