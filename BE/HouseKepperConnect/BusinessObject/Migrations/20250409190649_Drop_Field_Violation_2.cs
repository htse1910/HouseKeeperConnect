using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Drop_Field_Violation_2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
            name: "FK_Housekeeper_Violation_ViolationID",
            table: "Housekeeper");

            migrationBuilder.DropIndex(
            name: "IX_Housekeeper_ViolationID",
            table: "Housekeeper");

            migrationBuilder.DropColumn(
                name: "ViolationID",
                table: "Housekeeper");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}