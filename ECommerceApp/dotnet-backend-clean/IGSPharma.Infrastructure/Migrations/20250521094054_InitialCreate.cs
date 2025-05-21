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
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Products",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(255)", nullable: false),
                    Name = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ImageUrl = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false),
                    Category = table.Column<string>(type: "varchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "varchar(500)", maxLength: 500, nullable: true),
                    InStock = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    RequiresPrescription = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Dosage = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true),
                    Manufacturer = table.Column<string>(type: "varchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Products",
                columns: new[] { "Id", "Category", "Description", "Dosage", "ImageUrl", "InStock", "Manufacturer", "Name", "Price", "RequiresPrescription" },
                values: new object[,]
                {
                    { "otc-1", "otc", "Ibuprofen 200mg is an over-the-counter medication for temporary relief of minor aches and pains.", "3 tablet(s) daily", "https://placehold.co/200x200?text=otc+1", false, "ConsumerHealth", "Ibuprofen 200mg", 18.00m, false },
                    { "otc-2", "otc", "Acetaminophen 300mg is an over-the-counter medication for temporary relief of minor aches and pains.", "3 tablet(s) daily", "https://placehold.co/200x200?text=otc+2", true, "ComfortPharm", "Acetaminophen 300mg", 47.73m, false },
                    { "otc-3", "otc", "Aspirin 400mg is an over-the-counter medication for temporary relief of minor aches and pains.", "2 tablet(s) daily", "https://placehold.co/200x200?text=otc+3", false, "ComfortPharm", "Aspirin 400mg", 36.05m, false },
                    { "otc-4", "otc", "Loratadine 500mg is an over-the-counter medication for temporary relief of minor aches and pains.", "2 tablet(s) daily", "https://placehold.co/200x200?text=otc+4", false, "ConsumerHealth", "Loratadine 500mg", 47.92m, false },
                    { "otc-5", "otc", "Cetirizine 600mg is an over-the-counter medication for temporary relief of minor aches and pains.", "2 tablet(s) daily", "https://placehold.co/200x200?text=otc+5", true, "DailyHealth", "Cetirizine 600mg", 55.87m, false },
                    { "personal-care-1", "personal-care", "Hand Sanitizer is designed for daily personal hygiene and self-care.", null, "https://placehold.co/200x200?text=personal-care+1", false, "HygieneFirst", "Hand Sanitizer", 28.16m, false },
                    { "personal-care-2", "personal-care", "Moisturizing Lotion is designed for daily personal hygiene and self-care.", null, "https://placehold.co/200x200?text=personal-care+2", false, "CareProducts", "Moisturizing Lotion", 12.72m, false },
                    { "personal-care-3", "personal-care", "Sunscreen is designed for daily personal hygiene and self-care.", null, "https://placehold.co/200x200?text=personal-care+3", false, "CleanLiving", "Sunscreen", 46.84m, false },
                    { "personal-care-4", "personal-care", "Dental Floss is designed for daily personal hygiene and self-care.", null, "https://placehold.co/200x200?text=personal-care+4", true, "DailyCare", "Dental Floss", 59.26m, false },
                    { "personal-care-5", "personal-care", "Antiseptic Spray is designed for daily personal hygiene and self-care.", null, "https://placehold.co/200x200?text=personal-care+5", true, "CareProducts", "Antiseptic Spray", 52.41m, false },
                    { "prescription-1", "prescription", "Lisinopril 20mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "3 tablet(s) daily", "https://placehold.co/200x200?text=prescription+1", true, "CureTech", "Lisinopril 20mg", 59.23m, true },
                    { "prescription-2", "prescription", "Atorvastatin 30mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "1 tablet(s) daily", "https://placehold.co/200x200?text=prescription+2", false, "PharmaCorp", "Atorvastatin 30mg", 46.94m, true },
                    { "prescription-3", "prescription", "Levothyroxine 40mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "3 tablet(s) daily", "https://placehold.co/200x200?text=prescription+3", true, "HealthRx", "Levothyroxine 40mg", 19.74m, true },
                    { "prescription-4", "prescription", "Metformin 50mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "1 tablet(s) daily", "https://placehold.co/200x200?text=prescription+4", true, "CureTech", "Metformin 50mg", 19.46m, true },
                    { "prescription-5", "prescription", "Amlodipine 60mg is a prescription medication that requires a valid prescription from a licensed healthcare provider.", "1 tablet(s) daily", "https://placehold.co/200x200?text=prescription+5", true, "CureTech", "Amlodipine 60mg", 38.33m, true },
                    { "vitamins-1", "vitamins", "Vitamin D3 1000IU helps support overall health and wellness as part of a balanced diet.", "2 tablet(s) daily", "https://placehold.co/200x200?text=vitamins+1", true, "NaturalHealth", "Vitamin D3 1000IU", 56.59m, false },
                    { "vitamins-2", "vitamins", "Vitamin B12 1500IU helps support overall health and wellness as part of a balanced diet.", "1 tablet(s) daily", "https://placehold.co/200x200?text=vitamins+2", false, "VitaEssentials", "Vitamin B12 1500IU", 47.86m, false },
                    { "vitamins-3", "vitamins", "Multivitamin 2000IU helps support overall health and wellness as part of a balanced diet.", "3 tablet(s) daily", "https://placehold.co/200x200?text=vitamins+3", true, "NaturalHealth", "Multivitamin 2000IU", 18.16m, false },
                    { "vitamins-4", "vitamins", "Vitamin C 2500IU helps support overall health and wellness as part of a balanced diet.", "3 tablet(s) daily", "https://placehold.co/200x200?text=vitamins+4", true, "WellnessPlus", "Vitamin C 2500IU", 10.55m, false },
                    { "vitamins-5", "vitamins", "Omega-3 3000IU helps support overall health and wellness as part of a balanced diet.", "1 tablet(s) daily", "https://placehold.co/200x200?text=vitamins+5", true, "NaturalHealth", "Omega-3 3000IU", 16.41m, false }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Products");
        }
    }
}
