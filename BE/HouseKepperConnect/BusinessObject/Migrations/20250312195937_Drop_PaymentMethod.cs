using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Drop_PaymentMethod : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop foreign key constraints from the Payment table
            migrationBuilder.DropForeignKey(
                name: "FK_Payment_PaymentMethod_PaymentMethodID",
                table: "Payment");

            // Drop the PaymentMethod table
            migrationBuilder.DropTable(
                name: "PaymentMethod");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}