using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class HK_Schedule_Table : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HouseKeeperSkill",
                columns: table => new
                {
                    HouseKeeperSkillID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HouseKeeperSkill", x => x.HouseKeeperSkillID);
                });

            migrationBuilder.CreateTable(
                name: "IDVerification",
                columns: table => new
                {
                    IDNumber = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FrontPhoto = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    BackPhoto = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    FacePhoto = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    Status = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IDVerification", x => x.IDNumber);
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
                name: "Slot",
                columns: table => new
                {
                    SlotID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Time = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Slot", x => x.SlotID);
                });

            migrationBuilder.CreateTable(
                name: "Violation",
                columns: table => new
                {
                    ViolationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HouseKeeperID = table.Column<int>(type: "int", nullable: false),
                    Times = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Violation", x => x.ViolationID);
                });

            migrationBuilder.CreateTable(
                name: "Housekeeper",
                columns: table => new
                {
                    HouseKeeperID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccountID = table.Column<int>(type: "int", nullable: false),
                    HouseKeeperSkillID = table.Column<int>(type: "int", nullable: false),
                    ViolationID = table.Column<int>(type: "int", nullable: true),
                    Review = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: true),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    BankAccountNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    JobCompleted = table.Column<int>(type: "int", nullable: false),
                    JobsApplied = table.Column<int>(type: "int", nullable: false),
                    IDNumber = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Housekeeper", x => x.HouseKeeperID);
                    table.ForeignKey(
                        name: "FK_Housekeeper_Account_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Account",
                        principalColumn: "AccountID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Housekeeper_HouseKeeperSkill_HouseKeeperSkillID",
                        column: x => x.HouseKeeperSkillID,
                        principalTable: "HouseKeeperSkill",
                        principalColumn: "HouseKeeperSkillID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Housekeeper_IDVerification_IDNumber",
                        column: x => x.IDNumber,
                        principalTable: "IDVerification",
                        principalColumn: "IDNumber",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Housekeeper_Violation_ViolationID",
                        column: x => x.ViolationID,
                        principalTable: "Violation",
                        principalColumn: "ViolationID");
                });

            migrationBuilder.CreateTable(
                name: "Schedule",
                columns: table => new
                {
                    ScheduleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HousekeeperID = table.Column<int>(type: "int", nullable: false),
                    SlotID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ScheduleTypeID = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedule", x => x.ScheduleID);
                    table.ForeignKey(
                        name: "FK_Schedule_Housekeeper_HousekeeperID",
                        column: x => x.HousekeeperID,
                        principalTable: "Housekeeper",
                        principalColumn: "HouseKeeperID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Schedule_ScheduleType_ScheduleTypeID",
                        column: x => x.ScheduleTypeID,
                        principalTable: "ScheduleType",
                        principalColumn: "ScheduleTypeID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Schedule_Slot_SlotID",
                        column: x => x.SlotID,
                        principalTable: "Slot",
                        principalColumn: "SlotID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_AccountID",
                table: "Housekeeper",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_HouseKeeperSkillID",
                table: "Housekeeper",
                column: "HouseKeeperSkillID");

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_IDNumber",
                table: "Housekeeper",
                column: "IDNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_ViolationID",
                table: "Housekeeper",
                column: "ViolationID");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_HousekeeperID",
                table: "Schedule",
                column: "HousekeeperID");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_ScheduleTypeID",
                table: "Schedule",
                column: "ScheduleTypeID");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_SlotID",
                table: "Schedule",
                column: "SlotID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Schedule");

            migrationBuilder.DropTable(
                name: "Housekeeper");

            migrationBuilder.DropTable(
                name: "ScheduleType");

            migrationBuilder.DropTable(
                name: "Slot");

            migrationBuilder.DropTable(
                name: "HouseKeeperSkill");

            migrationBuilder.DropTable(
                name: "IDVerification");

            migrationBuilder.DropTable(
                name: "Violation");
        }
    }
}