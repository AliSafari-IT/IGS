namespace IGSPharma.Domain.Entities
{
    public class Supplier
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string RegulatoryLicense { get; set; } = string.Empty;
        public DateTime ContractStartDate { get; set; }
        public DateTime? ContractEndDate { get; set; }

        // Navigation properties
        public virtual ICollection<ProductSupply> Supplies { get; set; } = new List<ProductSupply>();
    }

    public class ProductSupply
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ProductId { get; set; }
        public int QuantitySupplied { get; set; }
        public DateTime SupplyDate { get; set; }
        public string SupplierId { get; set; }

        // Navigation properties
        public virtual Supplier Supplier { get; set; }
        public virtual Product Product { get; set; }
    }
}