using IGSPharma.Application.DTOs;
using IGSPharma.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IGSPharma.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IProductService _productService;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(
            IProductService productService,
            ILogger<ProductsController> logger
        )
        {
            _productService = productService;
            _logger = logger;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<PagedResponse<ProductDto>>> GetProducts(
            [FromQuery] string? category,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 20
        )
        {
            var response = await _productService.GetAllProductsAsync(page, limit, category);
            _logger.LogInformation("GetProducts: {Response}", response);
            if (!response.Success)
            {
                return StatusCode(500, response);
            }

            return Ok(response);
        }

        // GET: api/products/search
        [HttpGet("search")]
        public async Task<ActionResult<PagedResponse<ProductDto>>> SearchProducts(
            [FromQuery] string? query,
            [FromQuery] int page = 1,
            [FromQuery] int limit = 20
        )
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest(
                    new PagedResponse<ProductDto>
                    {
                        Success = false,
                        Message = "Search query is required",
                    }
                );
            }

            var response = await _productService.SearchProductsAsync(query, page, limit);
            _logger.LogInformation("SearchProducts: {Response}", response);

            if (!response.Success)
            {
                return StatusCode(500, response);
            }

            return Ok(response);
        }

        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> GetProduct(string id)
        {
            var response = await _productService.GetProductByIdAsync(id);
            _logger.LogInformation("GetProduct: {Response}", response);

            if (!response.Success)
            {
                if (response.Message == "Product not found")
                {
                    return NotFound(response);
                }

                return StatusCode(500, response);
            }

            return Ok(response);
        }

        // POST: api/products
        [HttpPost]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> CreateProduct([FromBody] CreateProductRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _productService.CreateProductAsync(request);
            _logger.LogInformation("CreateProduct: {Response}", response);

            if (!response.Success)
            {
                return StatusCode(500, response);
            }

            return CreatedAtAction(nameof(GetProduct), new { id = response.Data?.Id }, response);
        }

        // PUT: api/products/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<ProductDto>>> UpdateProduct(string id, [FromBody] UpdateProductRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var response = await _productService.UpdateProductAsync(id, request);
            _logger.LogInformation("UpdateProduct: {Response}", response);

            if (!response.Success)
            {
                if (response.Message == "Product not found")
                {
                    return NotFound(response);
                }

                return StatusCode(500, response);
            }

            return Ok(response);
        }

        // DELETE: api/products/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteProduct(string id)
        {
            var response = await _productService.DeleteProductAsync(id);
            _logger.LogInformation("DeleteProduct: {Response}", response);

            if (!response.Success)
            {
                if (response.Message == "Product not found")
                {
                    return NotFound(response);
                }

                return StatusCode(500, response);
            }

            return Ok(response);
        }
    }
}
