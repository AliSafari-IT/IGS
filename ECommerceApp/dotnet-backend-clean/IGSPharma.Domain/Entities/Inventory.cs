namespace IGSPharma.Domain.Entities
{
    public class Inventory
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ProductId { get; set; }
        public int CurrentStock { get; set; }
        public DateTime LastUpdated { get; set; }
        public bool IsLowStock => CurrentStock < 10; // Threshold alert

        // Navigation property
        public virtual Product Product { get; set; }
    }
}