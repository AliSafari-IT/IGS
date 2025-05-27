using System.Collections.Generic;
using System.Threading.Tasks;
using IGSPharma.Application.DTOs;

namespace IGSPharma.Application.Interfaces
{
    public interface IChangelogService
    {
        Task<IEnumerable<ChangelogDto>> GetAllChangelogsAsync();
        Task<ApiResponse<ChangelogDto>> GetChangelogByIdAsync(string id);
        Task<ApiResponse<ChangelogDto>> GetChangelogByPathAsync(string path);
        Task<ApiResponse<ChangelogDto>> CreateChangelogAsync(CreateChangelogDto createChangelogDto);
        Task<ApiResponse<ChangelogDto>> UpdateChangelogAsync(
            string id,
            UpdateChangelogDto updateChangelogDto
        );
        Task<ApiResponse<bool>> DeleteChangelogAsync(string id);
        Task<ApiResponse<ChangelogDto>> SaveFileAsync(
            string path,
            string content,
            string username,
            string? name = null,
            string? version = null
        );
    }
}
