using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Drop_PaymentMethodID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
            name: "IX_Payment_PaymentMethodID",
            table: "Payment");
            migrationBuilder.DropColumn(
                name: "PaymentMethodID",
                table: "Payment");
            
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PaymentMethodID",
                table: "Payment",
                type: "int",
                nullable: true,
                defaultValue: 0);
        }
    }
}
