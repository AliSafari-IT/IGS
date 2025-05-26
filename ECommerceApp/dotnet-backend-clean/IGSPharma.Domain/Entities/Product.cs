namespace IGSPharma.Domain.Entities
{
    public class Product
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool InStock { get; set; } = true;
        public bool RequiresPrescription { get; set; }
        public string? Dosage { get; set; }
        public string? Manufacturer { get; set; }
        public string Barcode { get; set; } = string.Empty;
        public int StockQuantity { get; set; } = 0;
        public DateTime ExpiryDate { get; set; }
        public string RegulatoryApprovalNumber { get; set; } = string.Empty;
        public List<string> ActiveIngredients { get; set; } = new();

        // Navigation properties
        public virtual ICollection<ProductBatch> Batches { get; set; } = new List<ProductBatch>();
    }

    public class ProductBatch
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ProductId { get; set; }
        public DateTime ManufacturingDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public int Quantity { get; set; }
        public string BatchNumber { get; set; } = string.Empty;

        // Navigation property
        public virtual Product Product { get; set; }
    }
}