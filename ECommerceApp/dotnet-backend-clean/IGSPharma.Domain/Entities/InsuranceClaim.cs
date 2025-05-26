namespace IGSPharma.Domain.Entities
{
    public class InsuranceClaim
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string PrescriptionId { get; set; }
        public string InsuranceProvider { get; set; }
        public string PolicyNumber { get; set; }
        public decimal CoverageAmount { get; set; }
        public string ClaimStatus { get; set; } = "pending"; // pending, approved, rejected

        // Navigation property
        public virtual Prescription Prescription { get; set; }
    }
}