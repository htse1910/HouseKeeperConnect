using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_Account_HK_BankNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BankAccountNumber",
                table: "Housekeeper");

            migrationBuilder.AddColumn<long>(
                name: "BankAccountNumber",
                table: "Account",
                type: "bigint",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BankAccountNumber",
                table: "Account");

            migrationBuilder.AddColumn<string>(
                name: "BankAccountNumber",
                table: "Housekeeper",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}