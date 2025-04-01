using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Slot_ServiceType_Relation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
            name: "FK_Service_ServiceType_ServiceTypeID",
            table: "Service",
            column: "ServiceTypeID",
            principalTable: "ServiceType",
            principalColumn: "ServiceTypeID",
            onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Slot",
                table: "Slot",
                column: "SlotID"
                );

            migrationBuilder.AddForeignKey(
            name: "FK_Slot_Booking_Slots_Booking_SlotsId",
            table: "Booking_Slots",
            column: "SlotID",
            principalTable: "Slot",
            principalColumn: "SlotID",
            onDelete: ReferentialAction.Cascade);
            
            migrationBuilder.AddForeignKey(
            name: "FK_Slot_Job_Slots_Job_SlotsId",
            table: "Job_Slots",
            column: "SlotID",
            principalTable: "Slot",
            principalColumn: "SlotID",
            onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
