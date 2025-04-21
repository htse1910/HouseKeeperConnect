using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class addservice : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 2,
                columns: new[] { "Price", "ServiceName" },
                values: new object[] { 70000m, "Dọn dẹp định kỳ" });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 3,
                column: "Price",
                value: 120000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 4,
                column: "Price",
                value: 150000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 5,
                column: "Price",
                value: 90000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 6,
                column: "Price",
                value: 95000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 7,
                column: "Price",
                value: 95000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 8,
                column: "Price",
                value: 85000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 9,
                column: "Price",
                value: 85000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 10,
                column: "Price",
                value: 80000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 13,
                column: "Price",
                value: 60000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 14,
                column: "Price",
                value: 75000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 15,
                column: "Price",
                value: 65000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 16,
                column: "Price",
                value: 100000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 17,
                column: "Price",
                value: 120000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 18,
                column: "Price",
                value: 130000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 19,
                column: "Price",
                value: 150000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 20,
                column: "Price",
                value: 180000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 21,
                column: "Price",
                value: 95000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 22,
                column: "Price",
                value: 100000m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 2,
                columns: new[] { "Price", "ServiceName" },
                values: new object[] { 550000m, "Dọn dẹp định kỳ " });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 3,
                column: "Price",
                value: 2500000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 4,
                column: "Price",
                value: 3500000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 5,
                column: "Price",
                value: 95000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 6,
                column: "Price",
                value: 750000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 7,
                column: "Price",
                value: 500000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 8,
                column: "Price",
                value: 200000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 9,
                column: "Price",
                value: 3500000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 10,
                column: "Price",
                value: 350000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 13,
                column: "Price",
                value: 200000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 14,
                column: "Price",
                value: 350000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 15,
                column: "Price",
                value: 100000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 16,
                column: "Price",
                value: 325000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 17,
                column: "Price",
                value: 325000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 18,
                column: "Price",
                value: 1250000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 19,
                column: "Price",
                value: 400000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 20,
                column: "Price",
                value: 1250000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 21,
                column: "Price",
                value: 10000000m);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 22,
                column: "Price",
                value: 550000m);
        }
    }
}