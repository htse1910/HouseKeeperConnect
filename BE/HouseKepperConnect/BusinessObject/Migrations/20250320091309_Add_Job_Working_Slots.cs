using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Add_Job_Working_Slots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Job_Account_AccountID",
                table: "Job");

            migrationBuilder.DropTable(
                name: "DaysOfTheWeek");

            migrationBuilder.DropTable(
                name: "Schedule");

            migrationBuilder.DropColumn(
                name: "Frequency",
                table: "JobDetail");

            migrationBuilder.RenameColumn(
                name: "AccountID",
                table: "Job",
                newName: "FamilyID");

            migrationBuilder.RenameIndex(
                name: "IX_Job_AccountID",
                table: "Job",
                newName: "IX_Job_FamilyID");

            migrationBuilder.AddColumn<bool>(
                name: "IsOffered",
                table: "JobDetail",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "Job_Service",
                columns: table => new
                {
                    Job_ServiceId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    JobID = table.Column<int>(type: "int", nullable: false),
                    ServiceID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Job_Service", x => x.Job_ServiceId);
                    table.ForeignKey(
                        name: "FK_Job_Service_Job_JobID",
                        column: x => x.JobID,
                        principalTable: "Job",
                        principalColumn: "JobID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Job_Service_Service_ServiceID",
                        column: x => x.ServiceID,
                        principalTable: "Service",
                        principalColumn: "ServiceID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WorkingDays",
                columns: table => new
                {
                    DayID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkingDays", x => x.DayID);
                });

            migrationBuilder.CreateTable(
                name: "Booking_WorkingDays_Slots",
                columns: table => new
                {
                    Booking_WorkingDays_SlotsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingID = table.Column<int>(type: "int", nullable: false),
                    WorkingDaysID = table.Column<int>(type: "int", nullable: false),
                    SlotID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Booking_WorkingDays_Slots", x => x.Booking_WorkingDays_SlotsId);
                    table.ForeignKey(
                        name: "FK_Booking_WorkingDays_Slots_Booking_BookingID",
                        column: x => x.BookingID,
                        principalTable: "Booking",
                        principalColumn: "BookingID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Booking_WorkingDays_Slots_Slot_SlotID",
                        column: x => x.SlotID,
                        principalTable: "Slot",
                        principalColumn: "SlotID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Booking_WorkingDays_Slots_WorkingDays_WorkingDaysID",
                        column: x => x.WorkingDaysID,
                        principalTable: "WorkingDays",
                        principalColumn: "DayID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Housekeeper_Schedule",
                columns: table => new
                {
                    Housekeeper_ScheduleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HousekeeperID = table.Column<int>(type: "int", nullable: false),
                    SlotID = table.Column<int>(type: "int", nullable: false),
                    WorkingDaysID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Housekeeper_Schedule", x => x.Housekeeper_ScheduleID);
                    table.ForeignKey(
                        name: "FK_Housekeeper_Schedule_Housekeeper_HousekeeperID",
                        column: x => x.HousekeeperID,
                        principalTable: "Housekeeper",
                        principalColumn: "HousekeeperID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Housekeeper_Schedule_Slot_SlotID",
                        column: x => x.SlotID,
                        principalTable: "Slot",
                        principalColumn: "SlotID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Housekeeper_Schedule_WorkingDays_WorkingDaysID",
                        column: x => x.WorkingDaysID,
                        principalTable: "WorkingDays",
                        principalColumn: "DayID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Job_WorkingDays_Slots",
                columns: table => new
                {
                    Job_WorkingDays_SlotsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DayID = table.Column<int>(type: "int", nullable: false),
                    SlotID = table.Column<int>(type: "int", nullable: false),
                    JobID = table.Column<int>(type: "int", nullable: false),
                    WorkingDaysDayID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Job_WorkingDays_Slots", x => x.Job_WorkingDays_SlotsId);
                    table.ForeignKey(
                        name: "FK_Job_WorkingDays_Slots_Job_JobID",
                        column: x => x.JobID,
                        principalTable: "Job",
                        principalColumn: "JobID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Job_WorkingDays_Slots_Slot_SlotID",
                        column: x => x.SlotID,
                        principalTable: "Slot",
                        principalColumn: "SlotID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Job_WorkingDays_Slots_WorkingDays_WorkingDaysDayID",
                        column: x => x.WorkingDaysDayID,
                        principalTable: "WorkingDays",
                        principalColumn: "DayID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "WorkingDays",
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

            migrationBuilder.CreateIndex(
                name: "IX_Booking_WorkingDays_Slots_BookingID",
                table: "Booking_WorkingDays_Slots",
                column: "BookingID");

            migrationBuilder.CreateIndex(
                name: "IX_Booking_WorkingDays_Slots_SlotID",
                table: "Booking_WorkingDays_Slots",
                column: "SlotID");

            migrationBuilder.CreateIndex(
                name: "IX_Booking_WorkingDays_Slots_WorkingDaysID",
                table: "Booking_WorkingDays_Slots",
                column: "WorkingDaysID");

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_Schedule_HousekeeperID",
                table: "Housekeeper_Schedule",
                column: "HousekeeperID");

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_Schedule_SlotID",
                table: "Housekeeper_Schedule",
                column: "SlotID");

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_Schedule_WorkingDaysID",
                table: "Housekeeper_Schedule",
                column: "WorkingDaysID");

            migrationBuilder.CreateIndex(
                name: "IX_Job_Service_JobID",
                table: "Job_Service",
                column: "JobID");

            migrationBuilder.CreateIndex(
                name: "IX_Job_Service_ServiceID",
                table: "Job_Service",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_Job_WorkingDays_Slots_JobID",
                table: "Job_WorkingDays_Slots",
                column: "JobID");

            migrationBuilder.CreateIndex(
                name: "IX_Job_WorkingDays_Slots_SlotID",
                table: "Job_WorkingDays_Slots",
                column: "SlotID");

            migrationBuilder.CreateIndex(
                name: "IX_Job_WorkingDays_Slots_WorkingDaysDayID",
                table: "Job_WorkingDays_Slots",
                column: "WorkingDaysDayID");

            migrationBuilder.AddForeignKey(
                name: "FK_Job_Family_FamilyID",
                table: "Job",
                column: "FamilyID",
                principalTable: "Family",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Job_Family_FamilyID",
                table: "Job");

            migrationBuilder.DropTable(
                name: "Booking_WorkingDays_Slots");

            migrationBuilder.DropTable(
                name: "Housekeeper_Schedule");

            migrationBuilder.DropTable(
                name: "Job_Service");

            migrationBuilder.DropTable(
                name: "Job_WorkingDays_Slots");

            migrationBuilder.DropTable(
                name: "WorkingDays");

            migrationBuilder.DropColumn(
                name: "IsOffered",
                table: "JobDetail");

            migrationBuilder.RenameColumn(
                name: "FamilyID",
                table: "Job",
                newName: "AccountID");

            migrationBuilder.RenameIndex(
                name: "IX_Job_FamilyID",
                table: "Job",
                newName: "IX_Job_AccountID");

            migrationBuilder.AddColumn<string>(
                name: "Frequency",
                table: "JobDetail",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

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

            migrationBuilder.CreateTable(
                name: "Schedule",
                columns: table => new
                {
                    ScheduleID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HousekeeperID = table.Column<int>(type: "int", nullable: false),
                    SlotID = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedule", x => x.ScheduleID);
                    table.ForeignKey(
                        name: "FK_Schedule_Housekeeper_HousekeeperID",
                        column: x => x.HousekeeperID,
                        principalTable: "Housekeeper",
                        principalColumn: "HousekeeperID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Schedule_Slot_SlotID",
                        column: x => x.SlotID,
                        principalTable: "Slot",
                        principalColumn: "SlotID",
                        onDelete: ReferentialAction.Cascade);
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

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_HousekeeperID",
                table: "Schedule",
                column: "HousekeeperID");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_SlotID",
                table: "Schedule",
                column: "SlotID");

            migrationBuilder.AddForeignKey(
                name: "FK_Job_Account_AccountID",
                table: "Job",
                column: "AccountID",
                principalTable: "Account",
                principalColumn: "AccountID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}