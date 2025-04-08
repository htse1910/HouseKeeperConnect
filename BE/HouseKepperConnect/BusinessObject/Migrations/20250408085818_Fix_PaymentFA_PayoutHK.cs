using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_PaymentFA_PayoutHK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Housekeeper_HousekeeperID",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Payout_Wallet_WalletID",
                table: "Payout");

            migrationBuilder.DropIndex(
                name: "IX_Payout_WalletID",
                table: "Payout");

            migrationBuilder.DropColumn(
                name: "PayoutAmount",
                table: "Payout");

            migrationBuilder.DropColumn(
                name: "RemainingAmount",
                table: "Payment");

            migrationBuilder.DropColumn(
                name: "WalletReduction",
                table: "Payment");

            migrationBuilder.RenameColumn(
                name: "WalletWithdrawalAmount",
                table: "Payout",
                newName: "Amount");

            migrationBuilder.RenameColumn(
                name: "WalletID",
                table: "Payout",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "PayoutStatus",
                table: "Payout",
                newName: "BookingID");

            migrationBuilder.RenameColumn(
                name: "PaymentStatus",
                table: "Payment",
                newName: "Status");

            migrationBuilder.RenameColumn(
                name: "HousekeeperID",
                table: "Payment",
                newName: "JobID");

            migrationBuilder.RenameIndex(
                name: "IX_Payment_HousekeeperID",
                table: "Payment",
                newName: "IX_Payment_JobID");

            migrationBuilder.CreateIndex(
                name: "IX_Payout_BookingID",
                table: "Payout",
                column: "BookingID",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Job_JobID",
                table: "Payment",
                column: "JobID",
                principalTable: "Job",
                principalColumn: "JobID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payout_Booking_BookingID",
                table: "Payout",
                column: "BookingID",
                principalTable: "Booking",
                principalColumn: "BookingID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payment_Job_JobID",
                table: "Payment");

            migrationBuilder.DropForeignKey(
                name: "FK_Payout_Booking_BookingID",
                table: "Payout");

            migrationBuilder.DropIndex(
                name: "IX_Payout_BookingID",
                table: "Payout");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Payout",
                newName: "WalletID");

            migrationBuilder.RenameColumn(
                name: "BookingID",
                table: "Payout",
                newName: "PayoutStatus");

            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "Payout",
                newName: "WalletWithdrawalAmount");

            migrationBuilder.RenameColumn(
                name: "Status",
                table: "Payment",
                newName: "PaymentStatus");

            migrationBuilder.RenameColumn(
                name: "JobID",
                table: "Payment",
                newName: "HousekeeperID");

            migrationBuilder.RenameIndex(
                name: "IX_Payment_JobID",
                table: "Payment",
                newName: "IX_Payment_HousekeeperID");

            migrationBuilder.AddColumn<decimal>(
                name: "PayoutAmount",
                table: "Payout",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "RemainingAmount",
                table: "Payment",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "WalletReduction",
                table: "Payment",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateIndex(
                name: "IX_Payout_WalletID",
                table: "Payout",
                column: "WalletID");

            migrationBuilder.AddForeignKey(
                name: "FK_Payment_Housekeeper_HousekeeperID",
                table: "Payment",
                column: "HousekeeperID",
                principalTable: "Housekeeper",
                principalColumn: "HousekeeperID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payout_Wallet_WalletID",
                table: "Payout",
                column: "WalletID",
                principalTable: "Wallet",
                principalColumn: "WalletID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
