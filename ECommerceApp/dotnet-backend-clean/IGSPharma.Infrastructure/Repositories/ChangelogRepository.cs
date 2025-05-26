using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using IGSPharma.Domain.Entities;
using IGSPharma.Domain.Interfaces;
using IGSPharma.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace IGSPharma.Infrastructure.Repositories
{
    public class ChangelogRepository : IChangelogRepository
    {
        private readonly ApplicationDbContext _context;

        public ChangelogRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Changelog>> GetAllAsync()
        {
            return await _context.Changelogs.OrderByDescending(c => c.UpdatedAt).ToListAsync();
        }

        public async Task<Changelog> GetByIdAsync(string id)
        {
            return await _context.Changelogs.FirstOrDefaultAsync(c => c.Id == id);
        }

        public async Task<Changelog> GetByPathAsync(string path)
        {
            return await _context.Changelogs.FirstOrDefaultAsync(c => c.Path == path);
        }

        public async Task<Changelog> CreateAsync(Changelog changelog)
        {
            changelog.CreatedAt = DateTime.UtcNow;
            changelog.UpdatedAt = DateTime.UtcNow;

            // Calculate size based on content length
            changelog.Size = $"{(changelog.Content.Length / 1024.0):F1} KB";

            await _context.Changelogs.AddAsync(changelog);
            await _context.SaveChangesAsync();

            return changelog;
        }

        public async Task<Changelog> UpdateAsync(string id, Changelog changelog)
        {
            var existingChangelog = await _context.Changelogs.FirstOrDefaultAsync(c => c.Id == id);

            if (existingChangelog == null)
            {
                throw new KeyNotFoundException($"Changelog with ID {id} not found");
            }

            // Update properties
            existingChangelog.Name = changelog.Name;
            existingChangelog.Version = changelog.Version;
            existingChangelog.Content = changelog.Content;
            existingChangelog.UpdatedAt = DateTime.UtcNow;
            existingChangelog.LastModifiedBy = changelog.LastModifiedBy;
            existingChangelog.Size = $"{(changelog.Content.Length / 1024.0):F1} KB";

            _context.Changelogs.Update(existingChangelog);
            await _context.SaveChangesAsync();

            return existingChangelog;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var changelog = await _context.Changelogs.FirstOrDefaultAsync(c => c.Id == id);

            if (changelog == null)
            {
                return false;
            }

            _context.Changelogs.Remove(changelog);
            await _context.SaveChangesAsync();

            return true;
        }
    }
}
