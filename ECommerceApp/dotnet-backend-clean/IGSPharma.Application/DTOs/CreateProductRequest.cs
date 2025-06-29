using System.ComponentModel.DataAnnotations;

namespace IGSPharma.Application.DTOs
{
    public class CreateProductRequest
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public decimal Price { get; set; }

        public string ImageUrl { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Category { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        public bool InStock { get; set; } = true;

        public bool RequiresPrescription { get; set; }

        [StringLength(100)]
        public string? Dosage { get; set; }

        [StringLength(200)]
        public string? Manufacturer { get; set; }
    }
}
