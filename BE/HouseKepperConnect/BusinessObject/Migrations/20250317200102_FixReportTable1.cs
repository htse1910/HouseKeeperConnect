using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class FixReportTable1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ReviewByID",
                table: "Report",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Report_ReviewByID",
                table: "Report",
                column: "ReviewByID");

            migrationBuilder.AddForeignKey(
                name: "FK_Report_Account_ReviewByID",
                table: "Report",
                column: "ReviewByID",
                principalTable: "Account",
                principalColumn: "AccountID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Report_Account_ReviewByID",
                table: "Report");

            migrationBuilder.DropIndex(
                name: "IX_Report_ReviewByID",
                table: "Report");

            migrationBuilder.DropColumn(
                name: "ReviewByID",
                table: "Report");
        }
    }
}