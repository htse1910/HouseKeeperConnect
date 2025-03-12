using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Delete_Table_PaymentMethod : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
          

            // Seed dữ liệu cho bảng Gender
            migrationBuilder.InsertData(
                table: "Gender",
                columns: new[] { "GenderID", "Name" },
                values: new object[,]
                {
                    { 1, "Male" },
                    { 2, "Female" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Xóa dữ liệu bảng Gender khi rollback migration
            migrationBuilder.DeleteData("Gender", "GenderID", 1);
            migrationBuilder.DeleteData("Gender", "GenderID", 2);

           
        }
    }
}
