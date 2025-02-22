using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Fix_Transaction_ID : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: Drop the primary key constraint
            migrationBuilder.DropPrimaryKey(
                name: "PK_Transaction",
                table: "Transaction");

            // Step 2: Drop the existing TransactionID column
            migrationBuilder.DropColumn(
                name: "TransactionID",
                table: "Transaction");

            // Step 3: Recreate the TransactionID column without auto-increment
            migrationBuilder.AddColumn<int>(
                name: "TransactionID",
                table: "Transaction",
                type: "int",
                nullable: false);

            // Step 4: Add the primary key constraint back
            migrationBuilder.AddPrimaryKey(
                name: "PK_Transaction",
                table: "Transaction",
                column: "TransactionID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Step 1: Drop the new TransactionID column
            migrationBuilder.DropColumn(
                name: "TransactionID",
                table: "Transaction");

            // Step 2: Recreate the TransactionID column with auto-increment
            migrationBuilder.AddColumn<int>(
                name: "TransactionID",
                table: "Transaction",
                type: "int",
                nullable: false)
                .Annotation("SqlServer:Identity", "1, 1");

            // Step 3: Add the primary key constraint back
            migrationBuilder.AddPrimaryKey(
                name: "PK_Transaction",
                table: "Transaction",
                column: "TransactionID");
        }
    }
}