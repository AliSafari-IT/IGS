using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace IGSPharma.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddChangelogEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-1",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Price", "StockQuantity" },
                values: new object[] { "otc-1", "2 tablet(s) daily", new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1934), 28.16m, 6 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-2",
                columns: new[] { "Barcode", "ExpiryDate", "InStock", "Price", "StockQuantity" },
                values: new object[] { "otc-2", new DateTime(2035, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1947), false, 46.84m, 36 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-3",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "otc-3", "1 tablet(s) daily", new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1960), true, "WellnessCare", 52.41m, 59 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-4",
                columns: new[] { "Barcode", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "otc-4", new DateTime(2033, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1975), true, "WellnessCare", 22.25m, 5 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-5",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "otc-5", "3 tablet(s) daily", new DateTime(2028, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1987), "WellnessCare", 32.01m, 63 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-1",
                columns: new[] { "Barcode", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "personal-care-1", new DateTime(2030, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2216), true, "CleanLiving", 13.67m, 76 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-2",
                columns: new[] { "Barcode", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "personal-care-2", new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2227), true, "CleanLiving", 26.86m, 41 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-3",
                columns: new[] { "Barcode", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "personal-care-3", new DateTime(2032, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2238), true, "PureSkin", 19.31m, 97 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-4",
                columns: new[] { "Barcode", "ExpiryDate", "InStock", "Price", "StockQuantity" },
                values: new object[] { "personal-care-4", new DateTime(2027, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2257), false, 28.48m, 86 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-5",
                columns: new[] { "Barcode", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "personal-care-5", new DateTime(2029, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2269), "PureSkin", 25.54m, 10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-1",
                columns: new[] { "Barcode", "ExpiryDate", "StockQuantity" },
                values: new object[] { "prescription-1", new DateTime(2033, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1722), 5 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-2",
                columns: new[] { "Barcode", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "prescription-2", new DateTime(2035, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1785), "VitaLabs", 10.85m, 50 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-3",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "prescription-3", "1 tablet(s) daily", new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1798), "CureTech", 19.46m, 26 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-4",
                columns: new[] { "Barcode", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "prescription-4", new DateTime(2033, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1812), "PharmaCorp", 10.34m, 1 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-5",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Price", "StockQuantity" },
                values: new object[] { "prescription-5", "3 tablet(s) daily", new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1824), 47.73m, 14 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-1",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "vitamins-1", "3 tablet(s) daily", new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2077), "VitaEssentials", 20.80m, 75 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-2",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "vitamins-2", "3 tablet(s) daily", new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2093), true, "NaturalHealth", 20.64m, 10 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-3",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "vitamins-3", "1 tablet(s) daily", new DateTime(2033, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2106), "VitaEssentials", 31.42m, 56 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-4",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "vitamins-4", "1 tablet(s) daily", new DateTime(2032, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2126), false, "NaturalHealth", 34.69m, 70 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-5",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "vitamins-5", "3 tablet(s) daily", new DateTime(2032, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2139), "OrganicLife", 20.15m, 37 });

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "ActiveIngredients", "Barcode", "Category", "Description", "Dosage", "ExpiryDate", "ImageUrl", "InStock", "Manufacturer", "Name", "Price", "RegulatoryApprovalNumber", "RequiresPrescription", "StockQuantity" },
                values: new object[,]
                {
                    { "otc-10", "[]", "otc-10", "otc", "Cetirizine 600mg is an over-the-counter medication for temporary relief of minor aches and pains.", "2 tablet(s) daily", new DateTime(2032, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2060), "https://placehold.co/200x200?text=otc+10", false, "ReliefMed", "Cetirizine 600mg", 42.38m, "", false, 59 },
                    { "otc-6", "[]", "otc-6", "otc", "Cetirizine 600mg is an over-the-counter medication for temporary relief of minor aches and pains.", "1 tablet(s) daily", new DateTime(2030, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2011), "https://placehold.co/200x200?text=otc+6", false, "WellnessCare", "Cetirizine 600mg", 58.26m, "", false, 81 },
                    { "otc-7", "[]", "otc-7", "otc", "Cetirizine 600mg is an over-the-counter medication for temporary relief of minor aches and pains.", "1 tablet(s) daily", new DateTime(2029, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2023), "https://placehold.co/200x200?text=otc+7", true, "DailyHealth", "Cetirizine 600mg", 23.00m, "", false, 7 },
                    { "otc-8", "[]", "otc-8", "otc", "Cetirizine 600mg is an over-the-counter medication for temporary relief of minor aches and pains.", "2 tablet(s) daily", new DateTime(2029, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2036), "https://placehold.co/200x200?text=otc+8", false, "WellnessCare", "Cetirizine 600mg", 35.74m, "", false, 80 },
                    { "otc-9", "[]", "otc-9", "otc", "Cetirizine 600mg is an over-the-counter medication for temporary relief of minor aches and pains.", "2 tablet(s) daily", new DateTime(2030, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2048), "https://placehold.co/200x200?text=otc+9", true, "ReliefMed", "Cetirizine 600mg", 36.87m, "", false, 42 },
                    { "personal-care-10", "[]", "personal-care-10", "personal-care", "Antiseptic Spray is designed for daily personal hygiene and self-care.", null, new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2326), "https://placehold.co/200x200?text=personal-care+10", true, "DailyCare", "Antiseptic Spray", 48.36m, "", false, 9 },
                    { "personal-care-6", "[]", "personal-care-6", "personal-care", "Antiseptic Spray is designed for daily personal hygiene and self-care.", null, new DateTime(2027, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2279), "https://placehold.co/200x200?text=personal-care+6", true, "DailyCare", "Antiseptic Spray", 40.48m, "", false, 31 },
                    { "personal-care-7", "[]", "personal-care-7", "personal-care", "Antiseptic Spray is designed for daily personal hygiene and self-care.", null, new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2290), "https://placehold.co/200x200?text=personal-care+7", false, "DailyCare", "Antiseptic Spray", 10.10m, "", false, 72 },
                    { "personal-care-8", "[]", "personal-care-8", "personal-care", "Antiseptic Spray is designed for daily personal hygiene and self-care.", null, new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2303), "https://placehold.co/200x200?text=personal-care+8", true, "HygieneFirst", "Antiseptic Spray", 42.29m, "", false, 21 },
                    { "personal-care-9", "[]", "personal-care-9", "personal-care", "Antiseptic Spray is designed for daily personal hygiene and self-care.", null, new DateTime(2033, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2315), "https://placehold.co/200x200?text=personal-care+9", true, "CleanLiving", "Antiseptic Spray", 13.37m, "", false, 8 },
                    { "prescription-10", "[]", "prescription-10", "prescription", "Amlodipine 60mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "1 tablet(s) daily", new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1917), "https://placehold.co/200x200?text=prescription+10", true, "VitaLabs", "Amlodipine 60mg", 51.16m, "", true, 10 },
                    { "prescription-6", "[]", "prescription-6", "prescription", "Amlodipine 60mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "3 tablet(s) daily", new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1850), "https://placehold.co/200x200?text=prescription+6", true, "PharmaCorp", "Amlodipine 60mg", 39.80m, "", true, 10 },
                    { "prescription-7", "[]", "prescription-7", "prescription", "Amlodipine 60mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "2 tablet(s) daily", new DateTime(2035, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1863), "https://placehold.co/200x200?text=prescription+7", true, "VitaLabs", "Amlodipine 60mg", 55.87m, "", true, 88 },
                    { "prescription-8", "[]", "prescription-8", "prescription", "Amlodipine 60mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "3 tablet(s) daily", new DateTime(2027, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1890), "https://placehold.co/200x200?text=prescription+8", false, "PharmaCorp", "Amlodipine 60mg", 34.65m, "", true, 39 },
                    { "prescription-9", "[]", "prescription-9", "prescription", "Amlodipine 60mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "3 tablet(s) daily", new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1903), "https://placehold.co/200x200?text=prescription+9", true, "PharmaCorp", "Amlodipine 60mg", 18.16m, "", true, 55 },
                    { "vitamins-10", "[]", "vitamins-10", "vitamins", "Omega-3 3000IU helps support overall health and wellness as part of a balanced diet.", "3 tablet(s) daily", new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2202), "https://placehold.co/200x200?text=vitamins+10", false, "NaturalHealth", "Omega-3 3000IU", 32.93m, "", false, 60 },
                    { "vitamins-6", "[]", "vitamins-6", "vitamins", "Omega-3 3000IU helps support overall health and wellness as part of a balanced diet.", "3 tablet(s) daily", new DateTime(2030, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2151), "https://placehold.co/200x200?text=vitamins+6", true, "PureNutrition", "Omega-3 3000IU", 31.64m, "", false, 85 },
                    { "vitamins-7", "[]", "vitamins-7", "vitamins", "Omega-3 3000IU helps support overall health and wellness as part of a balanced diet.", "1 tablet(s) daily", new DateTime(2027, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2164), "https://placehold.co/200x200?text=vitamins+7", true, "OrganicLife", "Omega-3 3000IU", 19.98m, "", false, 76 },
                    { "vitamins-8", "[]", "vitamins-8", "vitamins", "Omega-3 3000IU helps support overall health and wellness as part of a balanced diet.", "2 tablet(s) daily", new DateTime(2027, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2176), "https://placehold.co/200x200?text=vitamins+8", true, "VitaEssentials", "Omega-3 3000IU", 11.29m, "", false, 95 },
                    { "vitamins-9", "[]", "vitamins-9", "vitamins", "Omega-3 3000IU helps support overall health and wellness as part of a balanced diet.", "1 tablet(s) daily", new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2188), "https://placehold.co/200x200?text=vitamins+9", true, "WellnessPlus", "Omega-3 3000IU", 17.57m, "", false, 51 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Changelogs_Path",
                table: "Changelogs",
                column: "Path",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Changelogs");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-10");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-6");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-7");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-8");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-9");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-10");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-6");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-7");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-8");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-9");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-10");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-6");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-7");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-8");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-9");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-10");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-6");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-7");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-8");

            migrationBuilder.DeleteData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-9");

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-1",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Price", "StockQuantity" },
                values: new object[] { "", "3 tablet(s) daily", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 18.00m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-2",
                columns: new[] { "Barcode", "ExpiryDate", "InStock", "Price", "StockQuantity" },
                values: new object[] { "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), true, 47.73m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-3",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", "2 tablet(s) daily", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "ComfortPharm", 36.05m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-4",
                columns: new[] { "Barcode", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "ConsumerHealth", 47.92m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-5",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", "2 tablet(s) daily", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "DailyHealth", 55.87m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-1",
                columns: new[] { "Barcode", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "HygieneFirst", 28.16m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-2",
                columns: new[] { "Barcode", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "CareProducts", 12.72m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-3",
                columns: new[] { "Barcode", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "CleanLiving", 46.84m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-4",
                columns: new[] { "Barcode", "ExpiryDate", "InStock", "Price", "StockQuantity" },
                values: new object[] { "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), true, 59.26m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-5",
                columns: new[] { "Barcode", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "CareProducts", 52.41m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-1",
                columns: new[] { "Barcode", "ExpiryDate", "StockQuantity" },
                values: new object[] { "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-2",
                columns: new[] { "Barcode", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "PharmaCorp", 46.94m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-3",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", "3 tablet(s) daily", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "HealthRx", 19.74m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-4",
                columns: new[] { "Barcode", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "CureTech", 19.46m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-5",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Price", "StockQuantity" },
                values: new object[] { "", "1 tablet(s) daily", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 38.33m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-1",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", "2 tablet(s) daily", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "NaturalHealth", 56.59m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-2",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", "1 tablet(s) daily", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), false, "VitaEssentials", 47.86m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-3",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", "3 tablet(s) daily", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "NaturalHealth", 18.16m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-4",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "InStock", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", "3 tablet(s) daily", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), true, "WellnessPlus", 10.55m, 0 });

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-5",
                columns: new[] { "Barcode", "Dosage", "ExpiryDate", "Manufacturer", "Price", "StockQuantity" },
                values: new object[] { "", "1 tablet(s) daily", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "NaturalHealth", 16.41m, 0 });
        }
    }
}
