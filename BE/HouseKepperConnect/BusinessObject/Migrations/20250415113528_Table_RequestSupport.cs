using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Table_RequestSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.CreateTable(
                name: "SupportRequests",
                columns: table => new
                {
                    RequestID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RequestedBy = table.Column<int>(type: "int", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    ReviewedBy = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReviewNote = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Picture = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupportRequests", x => x.RequestID);
                    table.ForeignKey(
                        name: "FK_SupportRequests_Account_RequestedBy",
                        column: x => x.RequestedBy,
                        principalTable: "Account",
                        principalColumn: "AccountID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_SupportRequests_Account_ReviewedBy",
                        column: x => x.ReviewedBy,
                        principalTable: "Account",
                        principalColumn: "AccountID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SupportRequests_RequestedBy",
                table: "SupportRequests",
                column: "RequestedBy");

            migrationBuilder.CreateIndex(
                name: "IX_SupportRequests_ReviewedBy",
                table: "SupportRequests",
                column: "ReviewedBy");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SupportRequests");

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
