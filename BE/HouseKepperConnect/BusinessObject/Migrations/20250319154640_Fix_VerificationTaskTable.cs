using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_VerificationTaskTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VerificationTask_Account_AccountID",
                table: "VerificationTask");

            migrationBuilder.AlterColumn<int>(
                name: "AccountID",
                table: "VerificationTask",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_VerificationTask_Account_AccountID",
                table: "VerificationTask",
                column: "AccountID",
                principalTable: "Account",
                principalColumn: "AccountID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VerificationTask_Account_AccountID",
                table: "VerificationTask");

            migrationBuilder.AlterColumn<int>(
                name: "AccountID",
                table: "VerificationTask",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_VerificationTask_Account_AccountID",
                table: "VerificationTask",
                column: "AccountID",
                principalTable: "Account",
                principalColumn: "AccountID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
