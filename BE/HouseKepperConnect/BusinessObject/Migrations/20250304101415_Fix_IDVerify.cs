using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_IDVerify : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop the foreign key constraint if it exists
            migrationBuilder.DropForeignKey(
                name: "FK_Housekeeper_IDVerification_IDNumber",
                table: "Housekeeper");

            // Drop the index on IDNumber before dropping the column
            migrationBuilder.DropIndex(
                name: "IX_Housekeeper_IDNumber",
                table: "Housekeeper");

            // Drop the IDNumber column from Housekeeper
            migrationBuilder.DropColumn(
                name: "IDNumber",
                table: "Housekeeper");

            // If IDNumber is part of the primary key in IDVerification,
            // you need to drop that primary key first.
            migrationBuilder.DropPrimaryKey(
                name: "PK_IDVerification",
                table: "IDVerification");

            // Drop the IDNumber column from IDVerification
            migrationBuilder.DropColumn(
                name: "IDNumber",
                table: "IDVerification");

            // Drop the Review column from Housekeeper if it exists
            migrationBuilder.DropColumn(
                name: "Review",
                table: "Housekeeper");

            // Alter the Status column in IDVerification
            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "IDVerification",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            // Add the VerifyID column to IDVerification with identity
            migrationBuilder.AddColumn<int>(
                name: "VerifyID",
                table: "IDVerification",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            // Add additional columns to IDVerification
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "IDVerification",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "DateOfBirth",
                table: "IDVerification",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "RealName",
                table: "IDVerification",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "IDVerification",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            // Add VerifyID column to Housekeeper
            migrationBuilder.AddColumn<int>(
                name: "VerifyID",
                table: "Housekeeper",
                type: "int",
                nullable: true);

            // Add new primary key on VerifyID in IDVerification
            migrationBuilder.AddPrimaryKey(
                name: "PK_IDVerification",
                table: "IDVerification",
                column: "VerifyID");

            // Create an index on VerifyID in Housekeeper
            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_VerifyID",
                table: "Housekeeper",
                column: "VerifyID");

            // Add foreign key relationship from Housekeeper to IDVerification using VerifyID
            migrationBuilder.AddForeignKey(
                name: "FK_Housekeeper_IDVerification_VerifyID",
                table: "Housekeeper",
                column: "VerifyID",
                principalTable: "IDVerification",
                principalColumn: "VerifyID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Housekeeper_IDVerification_VerifyID",
                table: "Housekeeper");

            migrationBuilder.DropPrimaryKey(
                name: "PK_IDVerification",
                table: "IDVerification");

            migrationBuilder.DropIndex(
                name: "IX_Housekeeper_VerifyID",
                table: "Housekeeper");

            migrationBuilder.DropColumn(
                name: "VerifyID",
                table: "IDVerification");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "IDVerification");

            migrationBuilder.DropColumn(
                name: "DateOfBirth",
                table: "IDVerification");

            migrationBuilder.DropColumn(
                name: "RealName",
                table: "IDVerification");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "IDVerification");

            migrationBuilder.DropColumn(
                name: "VerifyID",
                table: "Housekeeper");

            migrationBuilder.AlterColumn<bool>(
                name: "Status",
                table: "IDVerification",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "IDNumber",
                table: "IDVerification",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddColumn<int>(
                name: "IDNumber",
                table: "Housekeeper",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Review",
                table: "Housekeeper",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_IDVerification",
                table: "IDVerification",
                column: "IDNumber");

            migrationBuilder.CreateIndex(
                name: "IX_Housekeeper_IDNumber",
                table: "Housekeeper",
                column: "IDNumber");

            migrationBuilder.AddForeignKey(
                name: "FK_Housekeeper_IDVerification_IDNumber",
                table: "Housekeeper",
                column: "IDNumber",
                principalTable: "IDVerification",
                principalColumn: "IDNumber",
                onDelete: ReferentialAction.Cascade);
        }
    }
}