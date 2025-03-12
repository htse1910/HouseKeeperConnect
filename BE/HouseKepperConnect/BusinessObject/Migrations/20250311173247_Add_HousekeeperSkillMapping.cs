using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Add_HousekeeperSkillMapping : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "FamilyID",
                table: "Preference",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "HousekeeperSkillMapping",
                columns: table => new
                {
                    HousekeeperSkillMappingID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HousekeeperID = table.Column<int>(type: "int", nullable: false),
                    HouseKeeperSkillID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HousekeeperSkillMapping", x => x.HousekeeperSkillMappingID);
                    table.ForeignKey(
                        name: "FK_HousekeeperSkillMapping_HouseKeeperSkill_HouseKeeperSkillID",
                        column: x => x.HouseKeeperSkillID,
                        principalTable: "HouseKeeperSkill",
                        principalColumn: "HouseKeeperSkillID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_HousekeeperSkillMapping_Housekeeper_HousekeeperID",
                        column: x => x.HousekeeperID,
                        principalTable: "Housekeeper",
                        principalColumn: "HousekeeperID",
                        onDelete: ReferentialAction.Restrict);
                });

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
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "VerificationTask",
                columns: table => new
                {
                    TaskID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StaffID = table.Column<int>(type: "int", nullable: false),
                    VerifyID = table.Column<int>(type: "int", nullable: false),
                    AssignedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VerificationTask", x => x.TaskID);
                    table.ForeignKey(
                        name: "FK_VerificationTask_IDVerification_VerifyID",
                        column: x => x.VerifyID,
                        principalTable: "IDVerification",
                        principalColumn: "VerifyID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_VerificationTask_Staff_StaffID",
                        column: x => x.StaffID,
                        principalTable: "Staff",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Preference_FamilyID",
                table: "Preference",
                column: "FamilyID");

            migrationBuilder.CreateIndex(
                name: "IX_HousekeeperSkillMapping_HousekeeperID",
                table: "HousekeeperSkillMapping",
                column: "HousekeeperID");

            migrationBuilder.CreateIndex(
                name: "IX_HousekeeperSkillMapping_HouseKeeperSkillID",
                table: "HousekeeperSkillMapping",
                column: "HouseKeeperSkillID");

            migrationBuilder.CreateIndex(
                name: "IX_Staff_AccountID",
                table: "Staff",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_VerificationTask_StaffID",
                table: "VerificationTask",
                column: "StaffID");

            migrationBuilder.CreateIndex(
                name: "IX_VerificationTask_VerifyID",
                table: "VerificationTask",
                column: "VerifyID");

            migrationBuilder.AddForeignKey(
                name: "FK_Preference_Family_FamilyID",
                table: "Preference",
                column: "FamilyID",
                principalTable: "Family",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Preference_Family_FamilyID",
                table: "Preference");

            migrationBuilder.DropTable(
                name: "HousekeeperSkillMapping");

            migrationBuilder.DropTable(
                name: "VerificationTask");

            migrationBuilder.DropTable(
                name: "Staff");

            migrationBuilder.DropIndex(
                name: "IX_Preference_FamilyID",
                table: "Preference");

            migrationBuilder.DropColumn(
                name: "FamilyID",
                table: "Preference");
        }
    }
}