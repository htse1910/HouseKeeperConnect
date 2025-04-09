using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_Relations_1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Family_Service");

            migrationBuilder.DropTable(
                name: "Housekeeper_Schedule");

            migrationBuilder.DropTable(
                name: "JobListing_Application");

            migrationBuilder.DropTable(
                name: "Report");

            migrationBuilder.DropIndex(
                name: "IX_Payment_JobID",
                table: "Payment");

            migrationBuilder.DropIndex(
                name: "IX_JobDetail_JobID",
                table: "JobDetail");

            migrationBuilder.DropIndex(
                name: "IX_Housekeeper_AccountID",
                table: "Housekeeper");

            migrationBuilder.DropIndex(
                name: "IX_Housekeeper_VerifyID",
                table: "Housekeeper");

            migrationBuilder.DropIndex(
                name: "IX_Family_AccountID",
                table: "Family");

            migrationBuilder.DropIndex(
                name: "IX_Booking_JobID",
                table: "Booking");

            migrationBuilder.AddColumn<int>(
                name: "JobID",
                table: "Application",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Payment_JobID",
                table: "Payment",
                column: "JobID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_JobDetail_JobID",
                table: "JobDetail",
                column: "JobID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_AccountID",
                table: "Housekeeper",
                column: "AccountID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_VerifyID",
                table: "Housekeeper",
                column: "VerifyID",
                unique: true,
                filter: "[VerifyID] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Family_AccountID",
                table: "Family",
                column: "AccountID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Booking_JobID",
                table: "Booking",
                column: "JobID",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Application_JobID",
                table: "Application",
                column: "JobID");

            migrationBuilder.AddForeignKey(
                name: "FK_Application_Job_JobID",
                table: "Application",
                column: "JobID",
                principalTable: "Job",
                principalColumn: "JobID",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Application_Job_JobID",
                table: "Application");

            migrationBuilder.DropIndex(
                name: "IX_Payment_JobID",
                table: "Payment");

            migrationBuilder.DropIndex(
                name: "IX_JobDetail_JobID",
                table: "JobDetail");

            migrationBuilder.DropIndex(
                name: "IX_Housekeeper_AccountID",
                table: "Housekeeper");

            migrationBuilder.DropIndex(
                name: "IX_Housekeeper_VerifyID",
                table: "Housekeeper");

            migrationBuilder.DropIndex(
                name: "IX_Family_AccountID",
                table: "Family");

            migrationBuilder.DropIndex(
                name: "IX_Booking_JobID",
                table: "Booking");

            migrationBuilder.DropIndex(
                name: "IX_Application_JobID",
                table: "Application");

            migrationBuilder.DropColumn(
                name: "JobID",
                table: "Application");

            migrationBuilder.CreateTable(
                name: "Family_Service",
                columns: table => new
                {
                    Family_ServiceID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FamilyID = table.Column<int>(type: "int", nullable: false),
                    ServiceID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Family_Service", x => x.Family_ServiceID);
                    table.ForeignKey(
                        name: "FK_Family_Service_Family_FamilyID",
                        column: x => x.FamilyID,
                        principalTable: "Family",
                        principalColumn: "FamilyID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Family_Service_Service_ServiceID",
                        column: x => x.ServiceID,
                        principalTable: "Service",
                        principalColumn: "ServiceID",
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
                    DayOfWeek = table.Column<int>(type: "int", nullable: false)
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
                });

            migrationBuilder.CreateTable(
                name: "JobListing_Application",
                columns: table => new
                {
                    JobListingApplicationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ApplicationID = table.Column<int>(type: "int", nullable: false),
                    JobID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobListing_Application", x => x.JobListingApplicationID);
                    table.ForeignKey(
                        name: "FK_JobListing_Application_Application_ApplicationID",
                        column: x => x.ApplicationID,
                        principalTable: "Application",
                        principalColumn: "ApplicationID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_JobListing_Application_Job_JobID",
                        column: x => x.JobID,
                        principalTable: "Job",
                        principalColumn: "JobID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Report",
                columns: table => new
                {
                    ReportID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AccountID = table.Column<int>(type: "int", nullable: false),
                    BookingID = table.Column<int>(type: "int", nullable: false),
                    ReviewByID = table.Column<int>(type: "int", nullable: true),
                    CreateAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReportStatus = table.Column<int>(type: "int", nullable: false),
                    ReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    StaffResponse = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Report", x => x.ReportID);
                    table.ForeignKey(
                        name: "FK_Report_Account_AccountID",
                        column: x => x.AccountID,
                        principalTable: "Account",
                        principalColumn: "AccountID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Report_Account_ReviewByID",
                        column: x => x.ReviewByID,
                        principalTable: "Account",
                        principalColumn: "AccountID");
                    table.ForeignKey(
                        name: "FK_Report_Booking_BookingID",
                        column: x => x.BookingID,
                        principalTable: "Booking",
                        principalColumn: "BookingID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Payment_JobID",
                table: "Payment",
                column: "JobID");

            migrationBuilder.CreateIndex(
                name: "IX_JobDetail_JobID",
                table: "JobDetail",
                column: "JobID");

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_AccountID",
                table: "Housekeeper",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_VerifyID",
                table: "Housekeeper",
                column: "VerifyID");

            migrationBuilder.CreateIndex(
                name: "IX_Family_AccountID",
                table: "Family",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_Booking_JobID",
                table: "Booking",
                column: "JobID");

            migrationBuilder.CreateIndex(
                name: "IX_Family_Service_FamilyID",
                table: "Family_Service",
                column: "FamilyID");

            migrationBuilder.CreateIndex(
                name: "IX_Family_Service_ServiceID",
                table: "Family_Service",
                column: "ServiceID");

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_Schedule_HousekeeperID",
                table: "Housekeeper_Schedule",
                column: "HousekeeperID");

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_Schedule_SlotID",
                table: "Housekeeper_Schedule",
                column: "SlotID");

            migrationBuilder.CreateIndex(
                name: "IX_JobListing_Application_ApplicationID",
                table: "JobListing_Application",
                column: "ApplicationID");

            migrationBuilder.CreateIndex(
                name: "IX_JobListing_Application_JobID",
                table: "JobListing_Application",
                column: "JobID");

            migrationBuilder.CreateIndex(
                name: "IX_Report_AccountID",
                table: "Report",
                column: "AccountID");

            migrationBuilder.CreateIndex(
                name: "IX_Report_BookingID",
                table: "Report",
                column: "BookingID");

            migrationBuilder.CreateIndex(
                name: "IX_Report_ReviewByID",
                table: "Report",
                column: "ReviewByID");
        }
    }
}
