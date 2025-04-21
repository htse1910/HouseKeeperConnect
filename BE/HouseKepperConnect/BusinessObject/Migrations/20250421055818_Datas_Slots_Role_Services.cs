using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Datas_Slots_Role_Services : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 19);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 20);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 21);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 22);

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 1,
                column: "ServiceName",
                value: "Dọn dẹp");

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 2,
                columns: new[] { "Price", "ServiceName" },
                values: new object[] { 120000m, "Tổng vệ sinh nhà cửa" });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 3,
                columns: new[] { "Price", "ServiceName" },
                values: new object[] { 150000m, "Dọn dẹp sau sự kiện/tết" });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 4,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 95000m, "Giữ trẻ tại nhà nguyên ngày", 2 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 5,
                columns: new[] { "Price", "ServiceName" },
                values: new object[] { 95000m, "Chăm sóc người cao tuổi tại nhà" });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 6,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 85000m, "Nấu ăn theo bữa", 3 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 7,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 85000m, "Nấu ăn theo tuần/tháng", 3 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 8,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 30000m, "Giặt ủi", 4 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 9,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 10000m, "Ủi quần áo", 4 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 10,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 60000m, "Giặt hấp cao cấp", 4 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 11,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 75000m, "Chăm sóc cây cảnh", 5 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 12,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 65000m, "Tưới cây, cắt tỉa", 5 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 13,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 100000m, "Tắm & cắt tỉa lông thú cưng", 5 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 14,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 120000m, "Sửa chữa điện nước", 6 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 15,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 130000m, "Sơn sửa nội thất nhỏ", 6 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 16,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 150000m, "Thợ sửa chữa", 6 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 17,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 180000m, "Giúp việc theo yêu cầu (dịch vụ VIP)", 7 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 18,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 100000m, "Hỗ trợ vận chuyển đồ đạc nhẹ", 7 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 1,
                column: "ServiceName",
                value: "Dọn dẹp theo giờ");

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 2,
                columns: new[] { "Price", "ServiceName" },
                values: new object[] { 70000m, "Dọn dẹp định kỳ" });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 3,
                columns: new[] { "Price", "ServiceName" },
                values: new object[] { 120000m, "Tổng vệ sinh nhà cửa" });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 4,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 150000m, "Dọn dẹp sau sự kiện/tết", 1 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 5,
                columns: new[] { "Price", "ServiceName" },
                values: new object[] { 90000m, "Giữ trẻ theo giờ" });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 6,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 95000m, "Giữ trẻ tại nhà nguyên ngày", 2 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 7,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 95000m, "Chăm sóc người cao tuổi tại nhà", 2 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 8,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 85000m, "Nấu ăn theo bữa", 3 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 9,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 85000m, "Nấu ăn theo tuần/tháng", 3 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 10,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 80000m, "Mua sắm thực phẩm & lên thực đơn", 3 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 11,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 30000m, "Giặt ủi theo kg", 4 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 12,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 10000m, "Ủi quần áo theo bộ", 4 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 13,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 60000m, "Giặt hấp cao cấp", 4 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 14,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 75000m, "Chăm sóc cây cảnh", 5 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 15,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 65000m, "Tưới cây, cắt tỉa hàng tuần", 5 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 16,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 100000m, "Tắm & cắt tỉa lông thú cưng", 5 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 17,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 120000m, "Sửa chữa điện nước", 6 });

            migrationBuilder.UpdateData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 18,
                columns: new[] { "Price", "ServiceName", "ServiceTypeID" },
                values: new object[] { 130000m, "Sơn sửa nội thất nhỏ", 6 });

            migrationBuilder.InsertData(
                table: "Service",
                columns: new[] { "ServiceID", "Description", "Price", "ServiceName", "ServiceTypeID" },
                values: new object[,]
                {
                    { 19, "", 150000m, "Thợ sửa chữa theo giờ", 6 },
                    { 20, "", 180000m, "Giúp việc theo yêu cầu (dịch vụ VIP)", 7 },
                    { 21, "", 95000m, "Dịch vụ giúp việc theo tháng", 7 },
                    { 22, "", 100000m, "Hỗ trợ vận chuyển đồ đạc nhẹ", 7 }
                });
        }
    }
}