using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_AccountTableVsFamilyTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Nickname",
                table: "Family");

            migrationBuilder.AddColumn<string>(
                name: "Gender",
                table: "Account",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Nickname",
                table: "Account",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Gender",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "Nickname",
                table: "Account");

            migrationBuilder.AddColumn<string>(
                name: "Nickname",
                table: "Family",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}