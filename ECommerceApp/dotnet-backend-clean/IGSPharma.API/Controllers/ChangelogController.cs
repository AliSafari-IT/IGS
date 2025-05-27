using System.Threading.Tasks;
using IGSPharma.Application.DTOs;
using IGSPharma.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace IGSPharma.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChangelogController : ControllerBase
    {
        private readonly IChangelogService _changelogService;
        private readonly ILogger<ChangelogController> _logger;

        public ChangelogController(
            IChangelogService changelogService,
            ILogger<ChangelogController> logger
        )
        {
            _changelogService = changelogService;
            _logger = logger;
        }

        // GET: api/changelog
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChangelogDto>>> GetChangelogs()
        {
            var changelogs = await _changelogService.GetAllChangelogsAsync();
            return Ok(changelogs);
        }

        // GET: api/changelog/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ChangelogDto>> GetChangelog(string id)
        {
            var response = await _changelogService.GetChangelogByIdAsync(id);
            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        // GET: api/changelog/bypath
        [HttpGet("bypath")]
        public async Task<ActionResult<ChangelogDto>> GetChangelogByPath([FromQuery] string path)
        {
            var response = await _changelogService.GetChangelogByPathAsync(path);
            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        // POST: api/changelog
        [HttpPost]
        public async Task<ActionResult<ChangelogDto>> CreateChangelog(
            [FromBody] CreateChangelogDto createChangelogDto
        )
        {
            var response = await _changelogService.CreateChangelogAsync(createChangelogDto);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return CreatedAtAction(nameof(GetChangelog), new { id = response.Data?.Id ?? string.Empty }, response);
        }

        // PUT: api/changelog/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult<ChangelogDto>> UpdateChangelog(
            string id,
            [FromBody] UpdateChangelogDto updateChangelogDto
        )
        {
            var response = await _changelogService.UpdateChangelogAsync(id, updateChangelogDto);
            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        // DELETE: api/changelog/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteChangelog(string id)
        {
            var response = await _changelogService.DeleteChangelogAsync(id);
            if (!response.Success)
            {
                return NotFound(response);
            }

            return Ok(response);
        }

        // POST: api/changelog/save-file
        [HttpPost("save-file")]
        public async Task<ActionResult<ChangelogDto>> SaveFile([FromBody] SaveFileRequest request)
        {
            if (string.IsNullOrEmpty(request.Path) || request.Content == null)
            {
                return BadRequest(
                    new ApiResponse<ChangelogDto>
                    {
                        Success = false,
                        Message = "Path and content are required",
                        Data = null,
                    }
                );
            }

            var username = User.Identity?.Name ?? "system";
            var response = await _changelogService.SaveFileAsync(
                request.Path,
                request.Content,
                username,
                request.Name,
                request.Version
            );

            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }

    public class SaveFileRequest
    {
        public string Path { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string? Name { get; set; }
        public string? Version { get; set; }
    }
}
