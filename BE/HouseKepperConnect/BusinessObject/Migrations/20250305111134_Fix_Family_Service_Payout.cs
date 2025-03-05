using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_Family_Service_Payout : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Payout_HousekeeperID",
                table: "Payout",
                column: "HousekeeperID");

            migrationBuilder.CreateIndex(
                name: "IX_Payout_WalletID",
                table: "Payout",
                column: "WalletID");

            migrationBuilder.CreateIndex(
                name: "IX_Family_Service_FamilyID",
                table: "Family_Service",
                column: "FamilyID");

            migrationBuilder.CreateIndex(
                name: "IX_Family_Service_ServiceID",
                table: "Family_Service",
                column: "ServiceID");

            migrationBuilder.AddForeignKey(
                name: "FK_Family_Service_Family_FamilyID",
                table: "Family_Service",
                column: "FamilyID",
                principalTable: "Family",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Family_Service_Service_ServiceID",
                table: "Family_Service",
                column: "ServiceID",
                principalTable: "Service",
                principalColumn: "ServiceID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payout_Housekeeper_HousekeeperID",
                table: "Payout",
                column: "HousekeeperID",
                principalTable: "Housekeeper",
                principalColumn: "HousekeeperID",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Payout_Wallet_WalletID",
                table: "Payout",
                column: "WalletID",
                principalTable: "Wallet",
                principalColumn: "WalletID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Family_Service_Family_FamilyID",
                table: "Family_Service");

            migrationBuilder.DropForeignKey(
                name: "FK_Family_Service_Service_ServiceID",
                table: "Family_Service");

            migrationBuilder.DropForeignKey(
                name: "FK_Payout_Housekeeper_HousekeeperID",
                table: "Payout");

            migrationBuilder.DropForeignKey(
                name: "FK_Payout_Wallet_WalletID",
                table: "Payout");

            migrationBuilder.DropIndex(
                name: "IX_Payout_HousekeeperID",
                table: "Payout");

            migrationBuilder.DropIndex(
                name: "IX_Payout_WalletID",
                table: "Payout");

            migrationBuilder.DropIndex(
                name: "IX_Family_Service_FamilyID",
                table: "Family_Service");

            migrationBuilder.DropIndex(
                name: "IX_Family_Service_ServiceID",
                table: "Family_Service");
        }
    }
}
