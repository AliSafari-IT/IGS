using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace IGSPharma.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSuperAdminRole : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-1",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8220));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-10",
                column: "ExpiryDate",
                value: new DateTime(2032, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8357));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-2",
                column: "ExpiryDate",
                value: new DateTime(2035, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8235));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-3",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8250));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-4",
                column: "ExpiryDate",
                value: new DateTime(2033, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8264));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-5",
                column: "ExpiryDate",
                value: new DateTime(2028, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8278));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-6",
                column: "ExpiryDate",
                value: new DateTime(2030, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8294));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-7",
                column: "ExpiryDate",
                value: new DateTime(2029, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8307));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-8",
                column: "ExpiryDate",
                value: new DateTime(2029, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8322));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-9",
                column: "ExpiryDate",
                value: new DateTime(2030, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8343));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-1",
                column: "ExpiryDate",
                value: new DateTime(2030, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8530));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-10",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8654));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-2",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8543));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-3",
                column: "ExpiryDate",
                value: new DateTime(2032, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8555));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-4",
                column: "ExpiryDate",
                value: new DateTime(2027, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8570));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-5",
                column: "ExpiryDate",
                value: new DateTime(2029, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8583));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-6",
                column: "ExpiryDate",
                value: new DateTime(2027, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8596));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-7",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8616));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-8",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8629));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-9",
                column: "ExpiryDate",
                value: new DateTime(2033, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8641));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-1",
                column: "ExpiryDate",
                value: new DateTime(2033, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8017));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-10",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8191));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-2",
                column: "ExpiryDate",
                value: new DateTime(2035, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8061));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-3",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8089));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-4",
                column: "ExpiryDate",
                value: new DateTime(2033, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8104));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-5",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8118));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-6",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8134));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-7",
                column: "ExpiryDate",
                value: new DateTime(2035, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8147));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-8",
                column: "ExpiryDate",
                value: new DateTime(2027, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8162));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-9",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8175));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-1",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8377));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-10",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8514));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-2",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8392));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-3",
                column: "ExpiryDate",
                value: new DateTime(2033, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8406));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-4",
                column: "ExpiryDate",
                value: new DateTime(2032, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8420));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-5",
                column: "ExpiryDate",
                value: new DateTime(2032, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8434));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-6",
                column: "ExpiryDate",
                value: new DateTime(2030, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8448));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-7",
                column: "ExpiryDate",
                value: new DateTime(2027, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8462));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-8",
                column: "ExpiryDate",
                value: new DateTime(2027, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8486));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-9",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 28, 19, 20, 28, 676, DateTimeKind.Local).AddTicks(8500));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-1",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1934));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-10",
                column: "ExpiryDate",
                value: new DateTime(2032, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2060));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-2",
                column: "ExpiryDate",
                value: new DateTime(2035, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1947));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-3",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1960));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-4",
                column: "ExpiryDate",
                value: new DateTime(2033, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1975));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-5",
                column: "ExpiryDate",
                value: new DateTime(2028, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1987));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-6",
                column: "ExpiryDate",
                value: new DateTime(2030, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2011));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-7",
                column: "ExpiryDate",
                value: new DateTime(2029, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2023));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-8",
                column: "ExpiryDate",
                value: new DateTime(2029, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2036));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "otc-9",
                column: "ExpiryDate",
                value: new DateTime(2030, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2048));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-1",
                column: "ExpiryDate",
                value: new DateTime(2030, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2216));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-10",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2326));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-2",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2227));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-3",
                column: "ExpiryDate",
                value: new DateTime(2032, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2238));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-4",
                column: "ExpiryDate",
                value: new DateTime(2027, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2257));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-5",
                column: "ExpiryDate",
                value: new DateTime(2029, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2269));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-6",
                column: "ExpiryDate",
                value: new DateTime(2027, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2279));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-7",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2290));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-8",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2303));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "personal-care-9",
                column: "ExpiryDate",
                value: new DateTime(2033, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2315));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-1",
                column: "ExpiryDate",
                value: new DateTime(2033, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1722));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-10",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1917));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-2",
                column: "ExpiryDate",
                value: new DateTime(2035, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1785));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-3",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1798));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-4",
                column: "ExpiryDate",
                value: new DateTime(2033, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1812));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-5",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1824));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-6",
                column: "ExpiryDate",
                value: new DateTime(2031, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1850));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-7",
                column: "ExpiryDate",
                value: new DateTime(2035, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1863));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-8",
                column: "ExpiryDate",
                value: new DateTime(2027, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1890));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "prescription-9",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(1903));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-1",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2077));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-10",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2202));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-2",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2093));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-3",
                column: "ExpiryDate",
                value: new DateTime(2033, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2106));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-4",
                column: "ExpiryDate",
                value: new DateTime(2032, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2126));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-5",
                column: "ExpiryDate",
                value: new DateTime(2032, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2139));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-6",
                column: "ExpiryDate",
                value: new DateTime(2030, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2151));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-7",
                column: "ExpiryDate",
                value: new DateTime(2027, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2164));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-8",
                column: "ExpiryDate",
                value: new DateTime(2027, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2176));

            migrationBuilder.UpdateData(
                table: "Products",
                keyColumn: "Id",
                keyValue: "vitamins-9",
                column: "ExpiryDate",
                value: new DateTime(2026, 5, 26, 23, 48, 8, 240, DateTimeKind.Local).AddTicks(2188));
        }
    }
}
