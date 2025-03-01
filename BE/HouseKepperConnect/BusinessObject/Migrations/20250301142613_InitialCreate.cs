using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Violation",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Violation_HouseKeeperID",
                table: "Violation",
                column: "HouseKeeperID");

            migrationBuilder.AddForeignKey(
                name: "FK_Violation_Housekeeper_HouseKeeperID",
                table: "Violation",
                column: "HouseKeeperID",
                principalTable: "Housekeeper",
                principalColumn: "HouseKeeperID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Violation_Housekeeper_HouseKeeperID",
                table: "Violation");

            migrationBuilder.DropIndex(
                name: "IX_Violation_HouseKeeperID",
                table: "Violation");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Violation",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(500)",
                oldMaxLength: 500);
        }
    }
}
