using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using IGSPharma.Domain.Entities;

namespace IGSPharma.Domain.Interfaces
{
    public interface IChangelogRepository
    {
        Task<IEnumerable<Changelog>> GetAllAsync();
        Task<Changelog> GetByIdAsync(string id);
        Task<Changelog> GetByPathAsync(string path);
        Task<Changelog> CreateAsync(Changelog changelog);
        Task<Changelog> UpdateAsync(string id, Changelog changelog);
        Task<bool> DeleteAsync(string id);
    }
}
