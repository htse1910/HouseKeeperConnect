using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_Service_ServiceType_Appilication : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
            name: "FK_Job_Service_Service_ServiceID",
            table: "Job_Service");

            migrationBuilder.DropForeignKey(
                name: "FK_Family_Service_Service_ServiceID",
                table: "Family_Service");
            migrationBuilder.DropForeignKey(
                name: "FK_Service_ServiceType_ServiceTypeID",
                table: "Service");

            migrationBuilder.DropPrimaryKey(
            name: "PK_Service",
            table: "Service");
            migrationBuilder.DropPrimaryKey(
            name: "PK_ServiceType",
            table: "ServiceType");
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Application");
            migrationBuilder.DropColumn(
                name: "ServiceID",
                table: "Service"
                );
            migrationBuilder.DropColumn(
                name: "ServiceTypeID",
                table: "ServiceType"
                );

            migrationBuilder.AddColumn<int>(
            name: "ServiceID",
            table: "Service",
            type: "int",
            nullable: false,
            defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ServiceTypeID",
                table: "ServiceType",
                type: "int",
                nullable: false,
                defaultValue: 0);
            migrationBuilder.AddPrimaryKey(
            name: "PK_Service",
            table: "Service",
            column: "ServiceID");
            migrationBuilder.AddPrimaryKey(
            name: "PK_ServiceType",
            table: "ServiceType",
            column: "ServiceTypeID");
            migrationBuilder.AddForeignKey(
            name: "FK_Job_Service_Service_ServiceID",
            table: "Job_Service",
            column: "ServiceID",
            principalTable: "Service",
            principalColumn: "ServiceID",
            onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Family_Service_Service_ServiceID",
                table: "Family_Service",
                column: "ServiceID",
                principalTable: "Service",
                principalColumn: "ServiceID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Application",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}