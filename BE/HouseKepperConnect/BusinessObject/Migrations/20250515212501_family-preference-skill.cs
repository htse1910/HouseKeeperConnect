using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class familypreferenceskill : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FamilyPreferenceSkill_HouseKeeperSkill_HousekeeperSkillID",
                table: "FamilyPreferenceSkill");

            migrationBuilder.RenameColumn(
                name: "HousekeeperSkillID",
                table: "FamilyPreferenceSkill",
                newName: "HouseKeeperSkillID");

            migrationBuilder.RenameIndex(
                name: "IX_FamilyPreferenceSkill_HousekeeperSkillID",
                table: "FamilyPreferenceSkill",
                newName: "IX_FamilyPreferenceSkill_HouseKeeperSkillID");

            migrationBuilder.AddForeignKey(
                name: "FK_FamilyPreferenceSkill_HouseKeeperSkill_HouseKeeperSkillID",
                table: "FamilyPreferenceSkill",
                column: "HouseKeeperSkillID",
                principalTable: "HouseKeeperSkill",
                principalColumn: "HouseKeeperSkillID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FamilyPreferenceSkill_HouseKeeperSkill_HouseKeeperSkillID",
                table: "FamilyPreferenceSkill");

            migrationBuilder.RenameColumn(
                name: "HouseKeeperSkillID",
                table: "FamilyPreferenceSkill",
                newName: "HousekeeperSkillID");

            migrationBuilder.RenameIndex(
                name: "IX_FamilyPreferenceSkill_HouseKeeperSkillID",
                table: "FamilyPreferenceSkill",
                newName: "IX_FamilyPreferenceSkill_HousekeeperSkillID");

            migrationBuilder.AddForeignKey(
                name: "FK_FamilyPreferenceSkill_HouseKeeperSkill_HousekeeperSkillID",
                table: "FamilyPreferenceSkill",
                column: "HousekeeperSkillID",
                principalTable: "HouseKeeperSkill",
                principalColumn: "HouseKeeperSkillID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
