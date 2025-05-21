using System;
using System.Collections.Generic;

namespace IGSPharma.Domain.Entities
{
    public class Prescription
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; }
        public string PrescriptionNumber { get; set; }
        public string DoctorName { get; set; }
        public string DoctorLicenseNumber { get; set; }
        public DateTime IssuedDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public string Status { get; set; } = "pending"; // pending, approved, rejected, expired
        public string Notes { get; set; }
        public string ImageUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        // Navigation properties
        public virtual User User { get; set; }
        public virtual ICollection<PrescriptionItem> Items { get; set; } = new List<PrescriptionItem>();
    }
    
    public class PrescriptionItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string PrescriptionId { get; set; }
        public string ProductId { get; set; }
        public string MedicationName { get; set; }
        public string Dosage { get; set; }
        public string Frequency { get; set; }
        public int Quantity { get; set; }
        public int Refills { get; set; }
        public string Instructions { get; set; }
        
        // Navigation properties
        public virtual Prescription Prescription { get; set; }
        public virtual Product Product { get; set; }
    }
}
