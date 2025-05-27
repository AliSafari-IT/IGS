using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IGSPharma.Application.DTOs;
using IGSPharma.Application.Interfaces;
using IGSPharma.Domain.Entities;
using IGSPharma.Domain.Interfaces;
using Microsoft.Extensions.Logging;

namespace IGSPharma.Application.Services
{
    public class ChangelogService : IChangelogService
    {
        private readonly IChangelogRepository _changelogRepository;
        private readonly ILogger<ChangelogService> _logger;

        public ChangelogService(
            IChangelogRepository changelogRepository,
            ILogger<ChangelogService> logger
        )
        {
            _changelogRepository = changelogRepository;
            _logger = logger;
        }

        public async Task<IEnumerable<ChangelogDto>> GetAllChangelogsAsync()
        {
            try
            {
                var changelogs = await _changelogRepository.GetAllAsync();
                return changelogs.Select(MapToDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all changelogs");
                return new List<ChangelogDto>();
            }
        }

        public async Task<ApiResponse<ChangelogDto>> GetChangelogByIdAsync(string id)
        {
            try
            {
                var changelog = await _changelogRepository.GetByIdAsync(id);
                if (changelog == null)
                {
                    return new ApiResponse<ChangelogDto>
                    {
                        Success = false,
                        Message = $"Changelog with ID {id} not found",
                        Data = null,
                    };
                }

                return new ApiResponse<ChangelogDto> { Success = true, Data = MapToDto(changelog) };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving changelog by ID: {Id}", id);
                return new ApiResponse<ChangelogDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the changelog",
                    Data = null,
                };
            }
        }

        public async Task<ApiResponse<ChangelogDto>> GetChangelogByPathAsync(string path)
        {
            try
            {
                var changelog = await _changelogRepository.GetByPathAsync(path);
                if (changelog == null)
                {
                    return new ApiResponse<ChangelogDto>
                    {
                        Success = false,
                        Message = $"Changelog with path {path} not found",
                        Data = null,
                    };
                }

                return new ApiResponse<ChangelogDto> { Success = true, Data = MapToDto(changelog) };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving changelog by path: {Path}", path);
                return new ApiResponse<ChangelogDto>
                {
                    Success = false,
                    Message = "An error occurred while retrieving the changelog",
                    Data = null,
                };
            }
        }

        public async Task<ApiResponse<ChangelogDto>> CreateChangelogAsync(
            CreateChangelogDto createChangelogDto
        )
        {
            try
            {
                var existingChangelog = await _changelogRepository.GetByPathAsync(
                    createChangelogDto.Path
                );
                if (existingChangelog != null)
                {
                    return new ApiResponse<ChangelogDto>
                    {
                        Success = false,
                        Message = $"A changelog with path {createChangelogDto.Path} already exists",
                        Data = null,
                    };
                }

                var changelog = new Changelog
                {
                    Name = createChangelogDto.Name,
                    Path = createChangelogDto.Path,
                    Version = createChangelogDto.Version,
                    Content = createChangelogDto.Content,
                    CreatedBy = createChangelogDto.CreatedBy,
                    LastModifiedBy = createChangelogDto.CreatedBy,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    IsActive = true,
                    Size = $"{(createChangelogDto.Content.Length / 1024.0):F1} KB",
                };

                var createdChangelog = await _changelogRepository.CreateAsync(changelog);
                return new ApiResponse<ChangelogDto>
                {
                    Success = true,
                    Message = "Changelog created successfully",
                    Data = MapToDto(createdChangelog),
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating changelog");
                return new ApiResponse<ChangelogDto>
                {
                    Success = false,
                    Message = "An error occurred while creating the changelog",
                    Data = null,
                };
            }
        }

        public async Task<ApiResponse<ChangelogDto>> UpdateChangelogAsync(
            string id,
            UpdateChangelogDto updateChangelogDto
        )
        {
            try
            {
                var existingChangelog = await _changelogRepository.GetByIdAsync(id);
                if (existingChangelog == null)
                {
                    return new ApiResponse<ChangelogDto>
                    {
                        Success = false,
                        Message = $"Changelog with ID {id} not found",
                        Data = null,
                    };
                }

                existingChangelog.Name = updateChangelogDto.Name;
                existingChangelog.Version = updateChangelogDto.Version;
                existingChangelog.Content = updateChangelogDto.Content;
                existingChangelog.LastModifiedBy = updateChangelogDto.LastModifiedBy;
                existingChangelog.UpdatedAt = DateTime.UtcNow;
                existingChangelog.Size = $"{(updateChangelogDto.Content.Length / 1024.0):F1} KB";

                var updatedChangelog = await _changelogRepository.UpdateAsync(
                    id,
                    existingChangelog
                );
                return new ApiResponse<ChangelogDto>
                {
                    Success = true,
                    Message = "Changelog updated successfully",
                    Data = MapToDto(updatedChangelog),
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating changelog with ID: {Id}", id);
                return new ApiResponse<ChangelogDto>
                {
                    Success = false,
                    Message = "An error occurred while updating the changelog",
                    Data = null,
                };
            }
        }

        public async Task<ApiResponse<bool>> DeleteChangelogAsync(string id)
        {
            try
            {
                var result = await _changelogRepository.DeleteAsync(id);
                if (!result)
                {
                    return new ApiResponse<bool>
                    {
                        Success = false,
                        Message = $"Changelog with ID {id} not found",
                        Data = false,
                    };
                }

                return new ApiResponse<bool>
                {
                    Success = true,
                    Message = "Changelog deleted successfully",
                    Data = true,
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting changelog with ID: {Id}", id);
                return new ApiResponse<bool>
                {
                    Success = false,
                    Message = "An error occurred while deleting the changelog",
                    Data = false,
                };
            }
        }

        public async Task<ApiResponse<ChangelogDto>> SaveFileAsync(
            string path,
            string content,
            string username,
            string? name = null,
            string? version = null
        )
        {
            try
            {
                // Check if the file already exists
                var existingChangelog = await _changelogRepository.GetByPathAsync(path);

                if (existingChangelog != null)
                {
                    // Update existing file
                    var updateDto = new UpdateChangelogDto
                    {
                        Name = name ?? existingChangelog.Name,
                        Version = version ?? existingChangelog.Version,
                        Content = content,
                        LastModifiedBy = username,
                    };

                    return await UpdateChangelogAsync(existingChangelog.Id, updateDto);
                }
                else
                {
                    // Create new file
                    var fileName = System.IO.Path.GetFileName(path);
                    var createDto = new CreateChangelogDto
                    {
                        Name = name ?? fileName,
                        Path = path,
                        Version = version ?? "1.0.0",
                        Content = content,
                        CreatedBy = username,
                    };

                    return await CreateChangelogAsync(createDto);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving file to path: {Path}", path);
                return new ApiResponse<ChangelogDto>
                {
                    Success = false,
                    Message = "An error occurred while saving the file",
                    Data = null,
                };
            }
        }

        private static ChangelogDto MapToDto(Changelog changelog)
        {
            return new ChangelogDto
            {
                Id = changelog.Id,
                Name = changelog.Name,
                Path = changelog.Path,
                Version = changelog.Version,
                Content = changelog.Content,
                CreatedAt = changelog.CreatedAt,
                UpdatedAt = changelog.UpdatedAt,
                Size = changelog.Size,
                IsActive = changelog.IsActive,
                CreatedBy = changelog.CreatedBy,
                LastModifiedBy = changelog.LastModifiedBy,
            };
        }
    }
}
