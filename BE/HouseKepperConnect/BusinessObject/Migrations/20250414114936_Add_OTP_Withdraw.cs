using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Add_OTP_Withdraw : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsOTPVerified",
                table: "Withdraw",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "OTPCode",
                table: "Withdraw",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "OTPCreatedTime",
                table: "Withdraw",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "OTPExpiredTime",
                table: "Withdraw",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsOTPVerified",
                table: "Withdraw");

            migrationBuilder.DropColumn(
                name: "OTPCode",
                table: "Withdraw");

            migrationBuilder.DropColumn(
                name: "OTPCreatedTime",
                table: "Withdraw");

            migrationBuilder.DropColumn(
                name: "OTPExpiredTime",
                table: "Withdraw");
        }
    }
}