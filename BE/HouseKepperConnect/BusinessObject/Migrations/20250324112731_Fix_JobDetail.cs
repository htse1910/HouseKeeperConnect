using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_JobDetail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobDetail_Service_ServiceID",
                table: "JobDetail");

            migrationBuilder.DropIndex(
                name: "IX_JobDetail_ServiceID",
                table: "JobDetail");

            migrationBuilder.DropColumn(
                name: "ServiceID",
                table: "JobDetail");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ServiceID",
                table: "JobDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_JobDetail_ServiceID",
                table: "JobDetail",
                column: "ServiceID");

            migrationBuilder.AddForeignKey(
                name: "FK_JobDetail_Service_ServiceID",
                table: "JobDetail",
                column: "ServiceID",
                principalTable: "Service",
                principalColumn: "ServiceID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}