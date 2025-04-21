using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class PlatformFee_Fix_JobDetailsField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FeeID",
                table: "JobDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "PlatformFee",
                columns: table => new
                {
                    FeeID = table.Column<int>(type: "int", nullable: false),
                    Percent = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlatformFee", x => x.FeeID);
                });

            migrationBuilder.InsertData(
                table: "PlatformFee",
                columns: new[] { "FeeID", "Percent" },
                values: new object[] { 1, 0.1m });

            migrationBuilder.CreateIndex(
                name: "IX_JobDetail_FeeID",
                table: "JobDetail",
                column: "FeeID");

            migrationBuilder.AddForeignKey(
                name: "FK_JobDetail_PlatformFee_FeeID",
                table: "JobDetail",
                column: "FeeID",
                principalTable: "PlatformFee",
                principalColumn: "FeeID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_JobDetail_PlatformFee_FeeID",
                table: "JobDetail");

            migrationBuilder.DropTable(
                name: "PlatformFee");

            migrationBuilder.DropIndex(
                name: "IX_JobDetail_FeeID",
                table: "JobDetail");

            migrationBuilder.DropColumn(
                name: "FeeID",
                table: "JobDetail");
        }
    }
}