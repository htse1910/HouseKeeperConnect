using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_HK_Family_Slot : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "WorkType",
                table: "Housekeeper",
                type: "int",
                nullable: true);

            migrationBuilder.DropForeignKey(
                name: "FK_Job_Slots_Slot_SlotID",
                table: "Job_Slots");

            migrationBuilder.DropForeignKey(
                name: "FK_Booking_Slots_Slot_SlotID",
                table: "Booking_Slots");

            migrationBuilder.DropForeignKey(
                name: "FK_Housekeeper_Schedule_Slot_SlotID",
                table: "Housekeeper_Schedule");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Slot",
                table: "Slot");

            migrationBuilder.DropColumn(
                name: "SlotID",
                table: "Slot");

            migrationBuilder.AddColumn<int>(
                name: "SlotID",
                table: "Slot",
                nullable: false);

            migrationBuilder.InsertData(
                table: "Slot",
                columns: new[] { "SlotID", "Time" },
                values: new object[,]
        {
                    { 1, "8H - 9H" },
                    { 2, "10H - 11H" },
                    { 3, "12H - 13H" },
                    { 4, "14H - 15H" },
                    { 5, "16H - 17H" },
                    { 6, "18H - 19H" },
                    { 7, "20H - 21H" }
        });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Slot",
                keyColumn: "SlotID",
                keyValue: 7);

            migrationBuilder.DropColumn(
                name: "Name",
                table: "Violation");

            migrationBuilder.DropColumn(
                name: "WorkType",
                table: "Housekeeper");
        }
    }
}