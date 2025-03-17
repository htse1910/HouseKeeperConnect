using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class FixReportTable2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Report_Account_ReviewByID",
                table: "Report");

            migrationBuilder.AlterColumn<int>(
                name: "ReviewByID",
                table: "Report",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Report_Account_ReviewByID",
                table: "Report",
                column: "ReviewByID",
                principalTable: "Account",
                principalColumn: "AccountID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Report_Account_ReviewByID",
                table: "Report");

            migrationBuilder.AlterColumn<int>(
                name: "ReviewByID",
                table: "Report",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Report_Account_ReviewByID",
                table: "Report",
                column: "ReviewByID",
                principalTable: "Account",
                principalColumn: "AccountID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
