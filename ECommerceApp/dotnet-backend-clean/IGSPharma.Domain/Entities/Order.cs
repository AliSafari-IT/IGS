using System;
using System.Collections.Generic;

namespace IGSPharma.Domain.Entities
{
    public class Order
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string UserId { get; set; }
        public string OrderNumber { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "pending"; // pending, processing, shipped, delivered, cancelled, refunded
        public decimal SubTotal { get; set; }
        public decimal ShippingCost { get; set; }
        public decimal TaxAmount { get; set; }
        public decimal DiscountAmount { get; set; } = 0; // Applied discounts
        public decimal TotalAmount => SubTotal + ShippingCost + TaxAmount - DiscountAmount;
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; } = "pending"; // pending, completed, failed, refunded
        public string ShippingAddressId { get; set; }
        public string BillingAddressId { get; set; }
        public string TrackingNumber { get; set; }
        public string ShippingMethod { get; set; }
        public DateTime? ShippedDate { get; set; }
        public DateTime? DeliveredDate { get; set; }
        public DateTime? RefundDate { get; set; } // Tracks refunds
        public string Notes { get; set; }

        // Loyalty tracking
        public int LoyaltyPointsEarned { get; set; } = 0; 
        public bool IsFirstOrder { get; set; }

        // Navigation properties
        public virtual User User { get; set; }
        public virtual Address ShippingAddress { get; set; }
        public virtual Address BillingAddress { get; set; }
        public virtual ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        public virtual ICollection<OrderAuditLog> AuditLogs { get; set; } = new List<OrderAuditLog>(); // Tracks order history
    }

    public class OrderItem
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string OrderId { get; set; }
        public string ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice => Price * Quantity;
        public string PrescriptionId { get; set; }
        public bool IsDiscountApplied { get; set; } = false; // Discount tracking

        // Navigation properties
        public virtual Order Order { get; set; }
        public virtual Product Product { get; set; }
        public virtual Prescription Prescription { get; set; }
    }

    public class OrderAuditLog
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string OrderId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string Action { get; set; } // Created, Updated, Cancelled, Refunded, Delivered
        public string Notes { get; set; }

        // Navigation property
        public virtual Order Order { get; set; }
    }
}