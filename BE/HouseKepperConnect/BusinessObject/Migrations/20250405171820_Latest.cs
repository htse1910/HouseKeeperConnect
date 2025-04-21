using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Latest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 2,
                column: "Time",
                value: "9H - 10H");

            migrationBuilder.UpdateData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 3,
                column: "Time",
                value: "10H - 11H");

            migrationBuilder.UpdateData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 4,
                column: "Time",
                value: "11H - 12H");

            migrationBuilder.UpdateData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 5,
                column: "Time",
                value: "12H - 13H");

            migrationBuilder.UpdateData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 6,
                column: "Time",
                value: "13H - 14H");

            migrationBuilder.UpdateData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 7,
                column: "Time",
                value: "14H - 15H");

            migrationBuilder.InsertData(
                table: "Slot",
                columns: new[] { "SlotID", "Time" },
                values: new object[,]
                {
                    { 8, "15H - 16H" },
                    { 9, "16H - 17H" },
                    { 10, "17H - 18H" },
                    { 11, "18H - 19H" },
                    { 12, "19H - 20H" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 12);

            migrationBuilder.UpdateData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 2,
                column: "Time",
                value: "10H - 11H");

            migrationBuilder.UpdateData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 3,
                column: "Time",
                value: "12H - 13H");

            migrationBuilder.UpdateData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 4,
                column: "Time",
                value: "14H - 15H");

            migrationBuilder.UpdateData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 5,
                column: "Time",
                value: "16H - 17H");

            migrationBuilder.UpdateData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 6,
                column: "Time",
                value: "18H - 19H");

            migrationBuilder.UpdateData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 7,
                column: "Time",
                value: "20H - 21H");
        }
    }
}