using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_Preference_ScheduleType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Account_Gender_GenderID",
                table: "Account");

            migrationBuilder.DropForeignKey(
                name: "FK_Schedule_ScheduleType_ScheduleTypeID",
                table: "Schedule");

            migrationBuilder.DropTable(
                name: "Preference");

            migrationBuilder.DropTable(
                name: "ScheduleType");

            migrationBuilder.DropTable(
                name: "Gender");

            migrationBuilder.DropTable(
                name: "Language");

            migrationBuilder.DropIndex(
                name: "IX_Schedule_ScheduleTypeID",
                table: "Schedule");

            migrationBuilder.DropIndex(
                name: "IX_Account_GenderID",
                table: "Account");

            migrationBuilder.DropColumn(
                name: "ScheduleTypeID",
                table: "Schedule");

            migrationBuilder.DropColumn(
                name: "GenderID",
                table: "Account");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "Job",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedDate",
                table: "Job",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Job");

            migrationBuilder.DropColumn(
                name: "UpdatedDate",
                table: "Job");

            migrationBuilder.AddColumn<int>(
                name: "ScheduleTypeID",
                table: "Schedule",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "GenderID",
                table: "Account",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Gender",
                columns: table => new
                {
                    GenderID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Gender", x => x.GenderID);
                });

            migrationBuilder.CreateTable(
                name: "Language",
                columns: table => new
                {
                    LanguageID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Language", x => x.LanguageID);
                });

            migrationBuilder.CreateTable(
                name: "ScheduleType",
                columns: table => new
                {
                    ScheduleTypeID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleType", x => x.ScheduleTypeID);
                });

            migrationBuilder.CreateTable(
                name: "Preference",
                columns: table => new
                {
                    PreferenceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FamilyID = table.Column<int>(type: "int", nullable: false),
                    GenderID = table.Column<int>(type: "int", nullable: true),
                    LanguageID = table.Column<int>(type: "int", nullable: true),
                    SkillID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Preference", x => x.PreferenceID);
                    table.ForeignKey(
                        name: "FK_Preference_Family_FamilyID",
                        column: x => x.FamilyID,
                        principalTable: "Family",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Preference_Gender_GenderID",
                        column: x => x.GenderID,
                        principalTable: "Gender",
                        principalColumn: "GenderID");
                    table.ForeignKey(
                        name: "FK_Preference_HouseKeeperSkill_SkillID",
                        column: x => x.SkillID,
                        principalTable: "HouseKeeperSkill",
                        principalColumn: "HouseKeeperSkillID");
                    table.ForeignKey(
                        name: "FK_Preference_Language_LanguageID",
                        column: x => x.LanguageID,
                        principalTable: "Language",
                        principalColumn: "LanguageID");
                });

            migrationBuilder.InsertData(
                table: "Gender",
                columns: new[] { "GenderID", "Name" },
                values: new object[,]
                {
                    { 1, "Male" },
                    { 2, "Female" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_ScheduleTypeID",
                table: "Schedule",
                column: "ScheduleTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_Account_GenderID",
                table: "Account",
                column: "GenderID");

            migrationBuilder.CreateIndex(
                name: "IX_Preference_FamilyID",
                table: "Preference",
                column: "FamilyID");

            migrationBuilder.CreateIndex(
                name: "IX_Preference_GenderID",
                table: "Preference",
                column: "GenderID");

            migrationBuilder.CreateIndex(
                name: "IX_Preference_LanguageID",
                table: "Preference",
                column: "LanguageID");

            migrationBuilder.CreateIndex(
                name: "IX_Preference_SkillID",
                table: "Preference",
                column: "SkillID");

            migrationBuilder.AddForeignKey(
                name: "FK_Account_Gender_GenderID",
                table: "Account",
                column: "GenderID",
                principalTable: "Gender",
                principalColumn: "GenderID");

            migrationBuilder.AddForeignKey(
                name: "FK_Schedule_ScheduleType_ScheduleTypeID",
                table: "Schedule",
                column: "ScheduleTypeID",
                principalTable: "ScheduleType",
                principalColumn: "ScheduleTypeID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}