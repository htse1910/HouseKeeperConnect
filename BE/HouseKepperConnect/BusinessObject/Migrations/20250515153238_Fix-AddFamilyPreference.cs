using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class FixAddFamilyPreference : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FamilyPreference",
                columns: table => new
                {
                    FamilyPreferenceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FamilyID = table.Column<int>(type: "int", nullable: false),
                    GenderPreference = table.Column<int>(type: "int", nullable: false),
                    LanguagePreference = table.Column<int>(type: "int", nullable: false),
                    LocationPreference = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyPreference", x => x.FamilyPreferenceID);
                    table.ForeignKey(
                        name: "FK_FamilyPreference_Family_FamilyID",
                        column: x => x.FamilyID,
                        principalTable: "Family",
                        principalColumn: "FamilyID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FamilyPreferenceSkill",
                columns: table => new
                {
                    FamilyPreferenceSkillID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FamilyPreferenceID = table.Column<int>(type: "int", nullable: false),
                    HousekeeperSkillID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FamilyPreferenceSkill", x => x.FamilyPreferenceSkillID);
                    table.ForeignKey(
                        name: "FK_FamilyPreferenceSkill_FamilyPreference_FamilyPreferenceID",
                        column: x => x.FamilyPreferenceID,
                        principalTable: "FamilyPreference",
                        principalColumn: "FamilyPreferenceID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FamilyPreferenceSkill_HouseKeeperSkill_HousekeeperSkillID",
                        column: x => x.HousekeeperSkillID,
                        principalTable: "HouseKeeperSkill",
                        principalColumn: "HouseKeeperSkillID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FamilyPreference_FamilyID",
                table: "FamilyPreference",
                column: "FamilyID");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyPreferenceSkill_FamilyPreferenceID",
                table: "FamilyPreferenceSkill",
                column: "FamilyPreferenceID");

            migrationBuilder.CreateIndex(
                name: "IX_FamilyPreferenceSkill_HousekeeperSkillID",
                table: "FamilyPreferenceSkill",
                column: "HousekeeperSkillID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FamilyPreferenceSkill");

            migrationBuilder.DropTable(
                name: "FamilyPreference");
        }
    }
}
