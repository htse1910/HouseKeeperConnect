using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class fix_Job_Detail_fix_Booking : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Booking_Service_ServiceID",
                table: "Booking");

            migrationBuilder.DropIndex(
                name: "IX_Booking_ServiceID",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "ServiceID",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "Booking");

            migrationBuilder.AddColumn<int>(
                name: "HousekeeperID",
                table: "JobDetail",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobDetail_HousekeeperID",
                table: "JobDetail",
                column: "HousekeeperID");

            migrationBuilder.AddForeignKey(
                name: "FK_JobDetail_Housekeeper_HousekeeperID",
                table: "JobDetail",
                column: "HousekeeperID",
                principalTable: "Housekeeper",
                principalColumn: "HousekeeperID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobDetail_Housekeeper_HousekeeperID",
                table: "JobDetail");

            migrationBuilder.DropIndex(
                name: "IX_JobDetail_HousekeeperID",
                table: "JobDetail");

            migrationBuilder.DropColumn(
                name: "HousekeeperID",
                table: "JobDetail");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Booking",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "ServiceID",
                table: "Booking",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "Booking",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateIndex(
                name: "IX_Booking_ServiceID",
                table: "Booking",
                column: "ServiceID");

            migrationBuilder.AddForeignKey(
                name: "FK_Booking_Service_ServiceID",
                table: "Booking",
                column: "ServiceID",
                principalTable: "Service",
                principalColumn: "ServiceID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}