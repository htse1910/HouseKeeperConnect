using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_HousekeepSkillMapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Housekeeper_HouseKeeperSkill_HouseKeeperSkillID",
                table: "Housekeeper");

            migrationBuilder.DropIndex(
                name: "IX_Housekeeper_HouseKeeperSkillID",
                table: "Housekeeper");

            migrationBuilder.DropColumn(
                name: "HouseKeeperSkillID",
                table: "Housekeeper");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "HouseKeeperSkillID",
                table: "Housekeeper",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_HouseKeeperSkillID",
                table: "Housekeeper",
                column: "HouseKeeperSkillID");

            migrationBuilder.AddForeignKey(
                name: "FK_Housekeeper_HouseKeeperSkill_HouseKeeperSkillID",
                table: "Housekeeper",
                column: "HouseKeeperSkillID",
                principalTable: "HouseKeeperSkill",
                principalColumn: "HouseKeeperSkillID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}