using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_Trans_Withdraw : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TransactionID",
                table: "Withdraw",
                type: "int",
                nullable: false);

            migrationBuilder.CreateIndex(
                name: "IX_Withdraw_TransactionID",
                table: "Withdraw",
                column: "TransactionID",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Withdraw_Transaction_TransactionID",
                table: "Withdraw",
                column: "TransactionID",
                principalTable: "Transaction",
                principalColumn: "TransactionID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Withdraw_Transaction_TransactionID",
                table: "Withdraw");

            migrationBuilder.DropIndex(
                name: "IX_Withdraw_TransactionID",
                table: "Withdraw");

            migrationBuilder.DropColumn(
                name: "TransactionID",
                table: "Withdraw");
        }
    }
}
