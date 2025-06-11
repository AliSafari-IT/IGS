using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace IGSPharma.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Changelogs",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Path = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Version = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Content = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Size = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedBy = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastModifiedBy = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Changelogs", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ImageUrl = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Category = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    InStock = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    RequiresPrescription = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Dosage = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Manufacturer = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Barcode = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    StockQuantity = table.Column<int>(type: "int", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    RegulatoryApprovalNumber = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ActiveIngredients = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PasswordHash = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FirstName = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PhoneNumber = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Role = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PrescriptionAccess = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    EmailConfirmed = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    ResetPasswordToken = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ResetPasswordTokenExpiry = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "ProductBatch",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProductId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ManufacturingDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    BatchNumber = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductBatch", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductBatch_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Addresses",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AddressLine1 = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AddressLine2 = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    City = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    State = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PostalCode = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Country = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsDefault = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    AddressType = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Addresses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Addresses_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Prescriptions",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PrescriptionNumber = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DoctorName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DoctorLicenseNumber = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IssuedDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ExpiryDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Notes = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImageUrl = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DigitalSignature = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Prescriptions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Prescriptions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    UserId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrderNumber = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrderDate = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Status = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SubTotal = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ShippingCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TaxAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DiscountAmount = table.Column<decimal>(type: "decimal(65,30)", nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PaymentMethod = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PaymentStatus = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ShippingAddressId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BillingAddressId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TrackingNumber = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ShippingMethod = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ShippedDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    DeliveredDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    RefundDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    Notes = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LoyaltyPointsEarned = table.Column<int>(type: "int", nullable: false),
                    IsFirstOrder = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Addresses_BillingAddressId",
                        column: x => x.BillingAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Orders_Addresses_ShippingAddressId",
                        column: x => x.ShippingAddressId,
                        principalTable: "Addresses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Orders_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "PrescriptionItems",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PrescriptionId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProductId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MedicationName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Dosage = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Frequency = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    Refills = table.Column<int>(type: "int", nullable: false),
                    Instructions = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    RequiresApproval = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PrescriptionItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PrescriptionItems_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PrescriptionItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OrderAuditLog",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrderId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Timestamp = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    Action = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Notes = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderAuditLog", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderAuditLog_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "OrderItems",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    OrderId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProductId = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ProductName = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PrescriptionId = table.Column<string>(type: "varchar(255)", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsDiscountApplied = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderItems_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderItems_Prescriptions_PrescriptionId",
                        column: x => x.PrescriptionId,
                        principalTable: "Prescriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderItems_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "ActiveIngredients", "Barcode", "Category", "Description", "Dosage", "ExpiryDate", "ImageUrl", "InStock", "Manufacturer", "Name", "Price", "RegulatoryApprovalNumber", "RequiresPrescription", "StockQuantity" },
                values: new object[,]
                {
                    { "otc-1", "[]", "otc-1", "otc", "Ibuprofen 200mg is an over-the-counter medication for temporary relief of minor aches and pains.", "2 tablet(s) daily", new DateTime(2026, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3513), "https://placehold.co/200x200?text=otc+1", false, "ConsumerHealth", "Ibuprofen 200mg", 28.16m, "", false, 6 },
                    { "otc-10", "[]", "otc-10", "otc", "Cetirizine 600mg is an over-the-counter medication for temporary relief of minor aches and pains.", "2 tablet(s) daily", new DateTime(2032, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3785), "https://placehold.co/200x200?text=otc+10", false, "ReliefMed", "Cetirizine 600mg", 42.38m, "", false, 59 },
                    { "otc-2", "[]", "otc-2", "otc", "Acetaminophen 300mg is an over-the-counter medication for temporary relief of minor aches and pains.", "3 tablet(s) daily", new DateTime(2035, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3535), "https://placehold.co/200x200?text=otc+2", false, "ComfortPharm", "Acetaminophen 300mg", 46.84m, "", false, 36 },
                    { "otc-3", "[]", "otc-3", "otc", "Aspirin 400mg is an over-the-counter medication for temporary relief of minor aches and pains.", "1 tablet(s) daily", new DateTime(2031, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3557), "https://placehold.co/200x200?text=otc+3", true, "WellnessCare", "Aspirin 400mg", 52.41m, "", false, 59 },
                    { "otc-4", "[]", "otc-4", "otc", "Loratadine 500mg is an over-the-counter medication for temporary relief of minor aches and pains.", "2 tablet(s) daily", new DateTime(2033, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3578), "https://placehold.co/200x200?text=otc+4", true, "WellnessCare", "Loratadine 500mg", 22.25m, "", false, 5 },
                    { "otc-5", "[]", "otc-5", "otc", "Cetirizine 600mg is an over-the-counter medication for temporary relief of minor aches and pains.", "3 tablet(s) daily", new DateTime(2028, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3599), "https://placehold.co/200x200?text=otc+5", true, "WellnessCare", "Cetirizine 600mg", 32.01m, "", false, 63 },
                    { "otc-6", "[]", "otc-6", "otc", "Cetirizine 600mg is an over-the-counter medication for temporary relief of minor aches and pains.", "1 tablet(s) daily", new DateTime(2030, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3624), "https://placehold.co/200x200?text=otc+6", false, "WellnessCare", "Cetirizine 600mg", 58.26m, "", false, 81 },
                    { "otc-7", "[]", "otc-7", "otc", "Cetirizine 600mg is an over-the-counter medication for temporary relief of minor aches and pains.", "1 tablet(s) daily", new DateTime(2029, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3646), "https://placehold.co/200x200?text=otc+7", true, "DailyHealth", "Cetirizine 600mg", 23.00m, "", false, 7 },
                    { "otc-8", "[]", "otc-8", "otc", "Cetirizine 600mg is an over-the-counter medication for temporary relief of minor aches and pains.", "2 tablet(s) daily", new DateTime(2029, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3740), "https://placehold.co/200x200?text=otc+8", false, "WellnessCare", "Cetirizine 600mg", 35.74m, "", false, 80 },
                    { "otc-9", "[]", "otc-9", "otc", "Cetirizine 600mg is an over-the-counter medication for temporary relief of minor aches and pains.", "2 tablet(s) daily", new DateTime(2030, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3763), "https://placehold.co/200x200?text=otc+9", true, "ReliefMed", "Cetirizine 600mg", 36.87m, "", false, 42 },
                    { "personal-care-1", "[]", "personal-care-1", "personal-care", "Hand Sanitizer is designed for daily personal hygiene and self-care.", null, new DateTime(2030, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4266), "https://placehold.co/200x200?text=personal-care+1", true, "CleanLiving", "Hand Sanitizer", 13.67m, "", false, 76 },
                    { "personal-care-10", "[]", "personal-care-10", "personal-care", "Antiseptic Spray is designed for daily personal hygiene and self-care.", null, new DateTime(2031, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4547), "https://placehold.co/200x200?text=personal-care+10", true, "DailyCare", "Antiseptic Spray", 48.36m, "", false, 9 },
                    { "personal-care-2", "[]", "personal-care-2", "personal-care", "Moisturizing Lotion is designed for daily personal hygiene and self-care.", null, new DateTime(2026, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4286), "https://placehold.co/200x200?text=personal-care+2", true, "CleanLiving", "Moisturizing Lotion", 26.86m, "", false, 41 },
                    { "personal-care-3", "[]", "personal-care-3", "personal-care", "Sunscreen is designed for daily personal hygiene and self-care.", null, new DateTime(2032, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4305), "https://placehold.co/200x200?text=personal-care+3", true, "PureSkin", "Sunscreen", 19.31m, "", false, 97 },
                    { "personal-care-4", "[]", "personal-care-4", "personal-care", "Dental Floss is designed for daily personal hygiene and self-care.", null, new DateTime(2027, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4331), "https://placehold.co/200x200?text=personal-care+4", false, "DailyCare", "Dental Floss", 28.48m, "", false, 86 },
                    { "personal-care-5", "[]", "personal-care-5", "personal-care", "Antiseptic Spray is designed for daily personal hygiene and self-care.", null, new DateTime(2029, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4350), "https://placehold.co/200x200?text=personal-care+5", true, "PureSkin", "Antiseptic Spray", 25.54m, "", false, 10 },
                    { "personal-care-6", "[]", "personal-care-6", "personal-care", "Antiseptic Spray is designed for daily personal hygiene and self-care.", null, new DateTime(2027, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4470), "https://placehold.co/200x200?text=personal-care+6", true, "DailyCare", "Antiseptic Spray", 40.48m, "", false, 31 },
                    { "personal-care-7", "[]", "personal-care-7", "personal-care", "Antiseptic Spray is designed for daily personal hygiene and self-care.", null, new DateTime(2031, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4490), "https://placehold.co/200x200?text=personal-care+7", false, "DailyCare", "Antiseptic Spray", 10.10m, "", false, 72 },
                    { "personal-care-8", "[]", "personal-care-8", "personal-care", "Antiseptic Spray is designed for daily personal hygiene and self-care.", null, new DateTime(2031, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4509), "https://placehold.co/200x200?text=personal-care+8", true, "HygieneFirst", "Antiseptic Spray", 42.29m, "", false, 21 },
                    { "personal-care-9", "[]", "personal-care-9", "personal-care", "Antiseptic Spray is designed for daily personal hygiene and self-care.", null, new DateTime(2033, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4527), "https://placehold.co/200x200?text=personal-care+9", true, "CleanLiving", "Antiseptic Spray", 13.37m, "", false, 8 },
                    { "prescription-1", "[]", "prescription-1", "prescription", "Lisinopril 20mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "3 tablet(s) daily", new DateTime(2033, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(2911), "https://placehold.co/200x200?text=prescription+1", true, "CureTech", "Lisinopril 20mg", 59.23m, "", true, 5 },
                    { "prescription-10", "[]", "prescription-10", "prescription", "Amlodipine 60mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "1 tablet(s) daily", new DateTime(2026, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3486), "https://placehold.co/200x200?text=prescription+10", true, "VitaLabs", "Amlodipine 60mg", 51.16m, "", true, 10 },
                    { "prescription-2", "[]", "prescription-2", "prescription", "Atorvastatin 30mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "1 tablet(s) daily", new DateTime(2035, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3206), "https://placehold.co/200x200?text=prescription+2", false, "VitaLabs", "Atorvastatin 30mg", 10.85m, "", true, 50 },
                    { "prescription-3", "[]", "prescription-3", "prescription", "Levothyroxine 40mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "1 tablet(s) daily", new DateTime(2031, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3234), "https://placehold.co/200x200?text=prescription+3", true, "CureTech", "Levothyroxine 40mg", 19.46m, "", true, 26 },
                    { "prescription-4", "[]", "prescription-4", "prescription", "Metformin 50mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "1 tablet(s) daily", new DateTime(2033, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3256), "https://placehold.co/200x200?text=prescription+4", true, "PharmaCorp", "Metformin 50mg", 10.34m, "", true, 1 },
                    { "prescription-5", "[]", "prescription-5", "prescription", "Amlodipine 60mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "3 tablet(s) daily", new DateTime(2031, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3276), "https://placehold.co/200x200?text=prescription+5", true, "CureTech", "Amlodipine 60mg", 47.73m, "", true, 14 },
                    { "prescription-6", "[]", "prescription-6", "prescription", "Amlodipine 60mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "3 tablet(s) daily", new DateTime(2031, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3301), "https://placehold.co/200x200?text=prescription+6", true, "PharmaCorp", "Amlodipine 60mg", 39.80m, "", true, 10 },
                    { "prescription-7", "[]", "prescription-7", "prescription", "Amlodipine 60mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "2 tablet(s) daily", new DateTime(2035, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3322), "https://placehold.co/200x200?text=prescription+7", true, "VitaLabs", "Amlodipine 60mg", 55.87m, "", true, 88 },
                    { "prescription-8", "[]", "prescription-8", "prescription", "Amlodipine 60mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "3 tablet(s) daily", new DateTime(2027, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3341), "https://placehold.co/200x200?text=prescription+8", false, "PharmaCorp", "Amlodipine 60mg", 34.65m, "", true, 39 },
                    { "prescription-9", "[]", "prescription-9", "prescription", "Amlodipine 60mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "3 tablet(s) daily", new DateTime(2026, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3362), "https://placehold.co/200x200?text=prescription+9", true, "PharmaCorp", "Amlodipine 60mg", 18.16m, "", true, 55 },
                    { "vitamins-1", "[]", "vitamins-1", "vitamins", "Vitamin D3 1000IU helps support overall health and wellness as part of a balanced diet.", "3 tablet(s) daily", new DateTime(2026, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3809), "https://placehold.co/200x200?text=vitamins+1", true, "VitaEssentials", "Vitamin D3 1000IU", 20.80m, "", false, 75 },
                    { "vitamins-10", "[]", "vitamins-10", "vitamins", "Omega-3 3000IU helps support overall health and wellness as part of a balanced diet.", "3 tablet(s) daily", new DateTime(2026, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4243), "https://placehold.co/200x200?text=vitamins+10", false, "NaturalHealth", "Omega-3 3000IU", 32.93m, "", false, 60 },
                    { "vitamins-2", "[]", "vitamins-2", "vitamins", "Vitamin B12 1500IU helps support overall health and wellness as part of a balanced diet.", "3 tablet(s) daily", new DateTime(2026, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3830), "https://placehold.co/200x200?text=vitamins+2", true, "NaturalHealth", "Vitamin B12 1500IU", 20.64m, "", false, 10 },
                    { "vitamins-3", "[]", "vitamins-3", "vitamins", "Multivitamin 2000IU helps support overall health and wellness as part of a balanced diet.", "1 tablet(s) daily", new DateTime(2033, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3849), "https://placehold.co/200x200?text=vitamins+3", true, "VitaEssentials", "Multivitamin 2000IU", 31.42m, "", false, 56 },
                    { "vitamins-4", "[]", "vitamins-4", "vitamins", "Vitamin C 2500IU helps support overall health and wellness as part of a balanced diet.", "1 tablet(s) daily", new DateTime(2032, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3870), "https://placehold.co/200x200?text=vitamins+4", false, "NaturalHealth", "Vitamin C 2500IU", 34.69m, "", false, 70 },
                    { "vitamins-5", "[]", "vitamins-5", "vitamins", "Omega-3 3000IU helps support overall health and wellness as part of a balanced diet.", "3 tablet(s) daily", new DateTime(2032, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3893), "https://placehold.co/200x200?text=vitamins+5", true, "OrganicLife", "Omega-3 3000IU", 20.15m, "", false, 37 },
                    { "vitamins-6", "[]", "vitamins-6", "vitamins", "Omega-3 3000IU helps support overall health and wellness as part of a balanced diet.", "3 tablet(s) daily", new DateTime(2030, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(3914), "https://placehold.co/200x200?text=vitamins+6", true, "PureNutrition", "Omega-3 3000IU", 31.64m, "", false, 85 },
                    { "vitamins-7", "[]", "vitamins-7", "vitamins", "Omega-3 3000IU helps support overall health and wellness as part of a balanced diet.", "1 tablet(s) daily", new DateTime(2027, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4174), "https://placehold.co/200x200?text=vitamins+7", true, "OrganicLife", "Omega-3 3000IU", 19.98m, "", false, 76 },
                    { "vitamins-8", "[]", "vitamins-8", "vitamins", "Omega-3 3000IU helps support overall health and wellness as part of a balanced diet.", "2 tablet(s) daily", new DateTime(2027, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4199), "https://placehold.co/200x200?text=vitamins+8", true, "VitaEssentials", "Omega-3 3000IU", 11.29m, "", false, 95 },
                    { "vitamins-9", "[]", "vitamins-9", "vitamins", "Omega-3 3000IU helps support overall health and wellness as part of a balanced diet.", "1 tablet(s) daily", new DateTime(2026, 6, 9, 20, 31, 38, 847, DateTimeKind.Local).AddTicks(4221), "https://placehold.co/200x200?text=vitamins+9", true, "WellnessPlus", "Omega-3 3000IU", 17.57m, "", false, 51 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Addresses_UserId",
                table: "Addresses",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Changelogs_Path",
                table: "Changelogs",
                column: "Path",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_OrderAuditLog_OrderId",
                table: "OrderAuditLog",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_OrderId",
                table: "OrderItems",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_PrescriptionId",
                table: "OrderItems",
                column: "PrescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderItems_ProductId",
                table: "OrderItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_BillingAddressId",
                table: "Orders",
                column: "BillingAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_ShippingAddressId",
                table: "Orders",
                column: "ShippingAddressId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionItems_PrescriptionId",
                table: "PrescriptionItems",
                column: "PrescriptionId");

            migrationBuilder.CreateIndex(
                name: "IX_PrescriptionItems_ProductId",
                table: "PrescriptionItems",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Prescriptions_UserId",
                table: "Prescriptions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductBatch_ProductId",
                table: "ProductBatch",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Changelogs");

            migrationBuilder.DropTable(
                name: "OrderAuditLog");

            migrationBuilder.DropTable(
                name: "OrderItems");

            migrationBuilder.DropTable(
                name: "PrescriptionItems");

            migrationBuilder.DropTable(
                name: "ProductBatch");

            migrationBuilder.DropTable(
                name: "Orders");

            migrationBuilder.DropTable(
                name: "Prescriptions");

            migrationBuilder.DropTable(
                name: "Products");

            migrationBuilder.DropTable(
                name: "Addresses");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
