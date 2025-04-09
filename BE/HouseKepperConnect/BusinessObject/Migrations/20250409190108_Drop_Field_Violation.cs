using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Drop_Field_Violation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
            name: "FK_Violation_Housekeeper_HouseKeeperID",
            table: "Violation");

            // Step 2: Drop the index
            migrationBuilder.DropIndex(
                name: "IX_Violation_HouseKeeperID",
                table: "Violation");
            migrationBuilder.DropColumn(
                name: "Times",
                table: "Violation");
            migrationBuilder.DropColumn(
                name: "HousekeeperID",
                table: "Violation");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
