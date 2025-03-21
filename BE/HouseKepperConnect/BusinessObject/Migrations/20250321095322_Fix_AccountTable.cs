using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_AccountTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ProfilePicture",
                table: "Account",
                newName: "GoogleProfilePicture");

            migrationBuilder.AddColumn<byte[]>(
                name: "LocalProfilePicture",
                table: "Account",
                type: "varbinary(max)",
                nullable: false,
                defaultValue: new byte[0]);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LocalProfilePicture",
                table: "Account");

            migrationBuilder.RenameColumn(
                name: "GoogleProfilePicture",
                table: "Account",
                newName: "ProfilePicture");
        }
    }
}
