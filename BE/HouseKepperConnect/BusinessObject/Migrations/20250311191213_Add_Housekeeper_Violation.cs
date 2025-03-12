using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Add_Housekeeper_Violation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Housekeeper_Violation",
                columns: table => new
                {
                    HousekeeperViolationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HousekeeperID = table.Column<int>(type: "int", nullable: false),
                    ViolationID = table.Column<int>(type: "int", nullable: false),
                    ViolationDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Housekeeper_Violation", x => x.HousekeeperViolationID);
                    table.ForeignKey(
                        name: "FK_Housekeeper_Violation_Housekeeper_HousekeeperID",
                        column: x => x.HousekeeperID,
                        principalTable: "Housekeeper",
                        principalColumn: "HousekeeperID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Housekeeper_Violation_Violation_ViolationID",
                        column: x => x.ViolationID,
                        principalTable: "Violation",
                        principalColumn: "ViolationID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_Violation_HousekeeperID",
                table: "Housekeeper_Violation",
                column: "HousekeeperID");

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_Violation_ViolationID",
                table: "Housekeeper_Violation",
                column: "ViolationID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Housekeeper_Violation");
        }
    }
}
