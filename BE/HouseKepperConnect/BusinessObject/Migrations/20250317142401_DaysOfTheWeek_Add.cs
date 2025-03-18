using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class DaysOfTheWeek_Add : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VerificationTask_Staff_StaffID",
                table: "VerificationTask");

            migrationBuilder.DropTable(
                name: "Staff");

            migrationBuilder.RenameColumn(
                name: "StaffID",
                table: "VerificationTask",
                newName: "AccountID");

            migrationBuilder.RenameIndex(
                name: "IX_VerificationTask_StaffID",
                table: "VerificationTask",
                newName: "IX_VerificationTask_AccountID");

            migrationBuilder.RenameColumn(
                name: "Introduce",
                table: "Account",
                newName: "Introduction");

            migrationBuilder.CreateTable(
                name: "DaysOfTheWeek",
                columns: table => new
                {
                    DayID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DaysOfTheWeek", x => x.DayID);
                });

            migrationBuilder.InsertData(
                table: "DaysOfTheWeek",
                columns: new[] { "DayID", "Name" },
                values: new object[,]
                {
                    { 1, "Monday" },
                    { 2, "Tuesday" },
                    { 3, "Wednesday" },
                    { 4, "Thursday" },
                    { 5, "Friday" },
                    { 6, "Saturday" },
                    { 7, "Sunday" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_VerificationTask_Account_AccountID",
                table: "VerificationTask",
                column: "AccountID",
                principalTable: "Account",
                principalColumn: "AccountID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_VerificationTask_Account_AccountID",
                table: "VerificationTask");

            migrationBuilder.DropTable(
                name: "DaysOfTheWeek");

            migrationBuilder.RenameColumn(
                name: "AccountID",
                table: "VerificationTask",
                newName: "StaffID");

            migrationBuilder.RenameIndex(
                name: "IX_VerificationTask_AccountID",
                table: "VerificationTask",
                newName: "IX_VerificationTask_StaffID");

            migrationBuilder.RenameColumn(
                name: "Introduction",
                table: "Account",
                newName: "Introduce");

            migrationBuilder.CreateTable(
                name: "Staff",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccountID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Staff", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Staff_Account_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Account",
                        principalColumn: "AccountID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Staff_AccountID",
                table: "Staff",
                column: "AccountID");

            migrationBuilder.AddForeignKey(
                name: "FK_VerificationTask_Staff_StaffID",
                table: "VerificationTask",
                column: "StaffID",
                principalTable: "Staff",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}