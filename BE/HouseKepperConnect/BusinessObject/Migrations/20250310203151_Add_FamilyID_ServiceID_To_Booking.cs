using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Add_FamilyID_ServiceID_To_Booking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FamilyID",
                table: "Booking",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SeerviceID",
                table: "Booking",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ServiceID",
                table: "Booking",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Booking_FamilyID",
                table: "Booking",
                column: "FamilyID");

            migrationBuilder.CreateIndex(
                name: "IX_Booking_ServiceID",
                table: "Booking",
                column: "ServiceID");

            migrationBuilder.AddForeignKey(
                name: "FK_Booking_Family_FamilyID",
                table: "Booking",
                column: "FamilyID",
                principalTable: "Family",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Booking_Service_ServiceID",
                table: "Booking",
                column: "ServiceID",
                principalTable: "Service",
                principalColumn: "ServiceID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Booking_Family_FamilyID",
                table: "Booking");

            migrationBuilder.DropForeignKey(
                name: "FK_Booking_Service_ServiceID",
                table: "Booking");

            migrationBuilder.DropIndex(
                name: "IX_Booking_FamilyID",
                table: "Booking");

            migrationBuilder.DropIndex(
                name: "IX_Booking_ServiceID",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "FamilyID",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "SeerviceID",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "ServiceID",
                table: "Booking");
        }
    }
}
