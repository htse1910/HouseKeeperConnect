using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_Job_Slots_Booking_Slots : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Housekeeper_Schedule_WorkingDays_WorkingDaysID",
                table: "Housekeeper_Schedule");

            migrationBuilder.DropTable(
                name: "Booking_WorkingDays_Slots");

            migrationBuilder.DropTable(
                name: "Job_WorkingDays_Slots");

            migrationBuilder.DropTable(
                name: "WorkingDays");

            migrationBuilder.DropIndex(
                name: "IX_Housekeeper_Schedule_WorkingDaysID",
                table: "Housekeeper_Schedule");

            migrationBuilder.DropColumn(
                name: "EndSlot",
                table: "JobDetail");

            migrationBuilder.DropColumn(
                name: "StartSlot",
                table: "JobDetail");

            migrationBuilder.RenameColumn(
                name: "WorkingDaysID",
                table: "Housekeeper_Schedule",
                newName: "DayOfWeek");

            migrationBuilder.RenameColumn(
                name: "ScheduledDate",
                table: "Booking",
                newName: "StartDate");

            migrationBuilder.AlterColumn<string>(
                name: "JobName",
                table: "Job",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "Booking",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "Booking_Slots",
                columns: table => new
                {
                    Booking_SlotsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingID = table.Column<int>(type: "int", nullable: false),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    SlotID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Booking_Slots", x => x.Booking_SlotsId);
                    table.ForeignKey(
                        name: "FK_Booking_Slots_Booking_BookingID",
                        column: x => x.BookingID,
                        principalTable: "Booking",
                        principalColumn: "BookingID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Booking_Slots_Slot_SlotID",
                        column: x => x.SlotID,
                        principalTable: "Slot",
                        principalColumn: "SlotID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Job_Slots",
                columns: table => new
                {
                    Job_SlotsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DayOfWeek = table.Column<int>(type: "int", nullable: false),
                    SlotID = table.Column<int>(type: "int", nullable: false),
                    JobID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Job_Slots", x => x.Job_SlotsId);
                    table.ForeignKey(
                        name: "FK_Job_Slots_Job_JobID",
                        column: x => x.JobID,
                        principalTable: "Job",
                        principalColumn: "JobID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Job_Slots_Slot_SlotID",
                        column: x => x.SlotID,
                        principalTable: "Slot",
                        principalColumn: "SlotID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Booking_Slots_BookingID",
                table: "Booking_Slots",
                column: "BookingID");

            migrationBuilder.CreateIndex(
                name: "IX_Booking_Slots_SlotID",
                table: "Booking_Slots",
                column: "SlotID");

            migrationBuilder.CreateIndex(
                name: "IX_Job_Slots_JobID",
                table: "Job_Slots",
                column: "JobID");

            migrationBuilder.CreateIndex(
                name: "IX_Job_Slots_SlotID",
                table: "Job_Slots",
                column: "SlotID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Booking_Slots");

            migrationBuilder.DropTable(
                name: "Job_Slots");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "Booking");

            migrationBuilder.RenameColumn(
                name: "DayOfWeek",
                table: "Housekeeper_Schedule",
                newName: "WorkingDaysID");

            migrationBuilder.RenameColumn(
                name: "StartDate",
                table: "Booking",
                newName: "ScheduledDate");

            migrationBuilder.AddColumn<int>(
                name: "EndSlot",
                table: "JobDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "StartSlot",
                table: "JobDetail",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<string>(
                name: "JobName",
                table: "Job",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(255)",
                oldMaxLength: 255);

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
                    SlotID = table.Column<int>(type: "int", nullable: false),
                    WorkingDaysID = table.Column<int>(type: "int", nullable: false)
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
                name: "Job_WorkingDays_Slots",
                columns: table => new
                {
                    Job_WorkingDays_SlotsId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    JobID = table.Column<int>(type: "int", nullable: false),
                    SlotID = table.Column<int>(type: "int", nullable: false),
                    WorkingDaysDayID = table.Column<int>(type: "int", nullable: false),
                    DayID = table.Column<int>(type: "int", nullable: false)
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
                name: "IX_Housekeeper_Schedule_WorkingDaysID",
                table: "Housekeeper_Schedule",
                column: "WorkingDaysID");

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
                name: "FK_Housekeeper_Schedule_WorkingDays_WorkingDaysID",
                table: "Housekeeper_Schedule",
                column: "WorkingDaysID",
                principalTable: "WorkingDays",
                principalColumn: "DayID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}