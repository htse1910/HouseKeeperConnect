using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Booking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Booking_Family_FamilyID",
                table: "Booking");

            migrationBuilder.DropIndex(
                name: "IX_Booking_FamilyID",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "BookingStatus",
                table: "Booking");

            migrationBuilder.RenameColumn(
                name: "FamilyID",
                table: "Booking",
                newName: "Status");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Booking",
                newName: "FamilyID");

            migrationBuilder.AddColumn<int>(
                name: "BookingStatus",
                table: "Booking",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Booking_FamilyID",
                table: "Booking",
                column: "FamilyID");

            migrationBuilder.AddForeignKey(
                name: "FK_Booking_Family_FamilyID",
                table: "Booking",
                column: "FamilyID",
                principalTable: "Family",
                principalColumn: "FamilyID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
