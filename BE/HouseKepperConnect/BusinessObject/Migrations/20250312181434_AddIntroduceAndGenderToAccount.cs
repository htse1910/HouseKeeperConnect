using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class AddIntroduceAndGenderToAccount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GenderID",
                table: "Account",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Introduce",
                table: "Account",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Account_GenderID",
                table: "Account",
                column: "GenderID");

            migrationBuilder.AddForeignKey(
                name: "FK_Account_Gender_GenderID",
                table: "Account",
                column: "GenderID",
                principalTable: "Gender",
                principalColumn: "GenderID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Account_Gender_GenderID",
                table: "Account");

            migrationBuilder.DropIndex(
                name: "IX_Account_GenderID",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "GenderID",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "Introduce",
                table: "Account");
        }
    }
}
