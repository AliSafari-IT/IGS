namespace IGSPharma.Domain.Entities
{
    public class Product
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool InStock { get; set; } = true;
        public bool RequiresPrescription { get; set; }
        public string? Dosage { get; set; }
        public string? Manufacturer { get; set; }
    }
}
