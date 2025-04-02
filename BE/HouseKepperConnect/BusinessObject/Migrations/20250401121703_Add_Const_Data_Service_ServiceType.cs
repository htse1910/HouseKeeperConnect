using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace BusinessObject.Migrations
{
    /// <inheritdoc />
    public partial class Add_Const_Data_Service_ServiceType : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "ServiceType",
                columns: new[] { "ServiceTypeID", "ServiceTypeName" },
                values: new object[,]
                {
                    { 1, "Dọn dẹp nhà cửa" },
                    { 2, "Chăm sóc trẻ em/người cao tuổi" },
                    { 3, "Nấu ăn tại nhà" },
                    { 4, "Giặt ủi & chăm sóc quần áo" },
                    { 5, "Chăm sóc sân vườn & thú cưng" },
                    { 6, "Dịch vụ sửa chữa & bảo trì nhà cửa" },
                    { 7, "Hỗ trợ đặc biệt" }
                });

            migrationBuilder.InsertData(
                table: "Service",
                columns: new[] { "ServiceID", "Description", "Price", "ServiceName", "ServiceTypeID" },
                values: new object[,]
                {
                    { 1, "", 75000m, "Dọn dẹp theo giờ", 1 },
                    { 2, "", 550000m, "Dọn dẹp định kỳ ", 1 },
                    { 3, "", 2500000m, "Tổng vệ sinh nhà cửa", 1 },
                    { 4, "", 3500000m, "Dọn dẹp sau sự kiện/tết", 1 },
                    { 5, "", 95000m, "Giữ trẻ theo giờ", 2 },
                    { 6, "", 750000m, "Giữ trẻ tại nhà nguyên ngày", 2 },
                    { 7, "", 500000m, "Chăm sóc người cao tuổi tại nhà", 2 },
                    { 8, "", 200000m, "Nấu ăn theo bữa", 3 },
                    { 9, "", 3500000m, "Nấu ăn theo tuần/tháng", 3 },
                    { 10, "", 350000m, "Mua sắm thực phẩm & lên thực đơn", 3 },
                    { 11, "", 30000m, "Giặt ủi theo kg", 4 },
                    { 12, "", 10000m, "Ủi quần áo theo bộ", 4 },
                    { 13, "", 200000m, "Giặt hấp cao cấp", 4 },
                    { 14, "", 350000m, "Chăm sóc cây cảnh", 5 },
                    { 15, "", 100000m, "Tưới cây, cắt tỉa hàng tuần", 5 },
                    { 16, "", 325000m, "Tắm & cắt tỉa lông thú cưng", 5 },
                    { 17, "", 325000m, "Sửa chữa điện nước", 6 },
                    { 18, "", 1250000m, "Sơn sửa nội thất nhỏ", 6 },
                    { 19, "", 400000m, "Thợ sửa chữa theo giờ", 6 },
                    { 20, "", 1250000m, "Giúp việc theo yêu cầu (dịch vụ VIP)", 7 },
                    { 21, "", 10000000m, "Dịch vụ giúp việc theo tháng", 7 },
                    { 22, "", 550000m, "Hỗ trợ vận chuyển đồ đạc nhẹ", 7 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 11);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 12);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 13);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 14);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 15);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 16);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 17);

            migrationBuilder.DeleteData(
                table: "Service",
                keyColumn: "ServiceID",
                keyValue: 18);

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

            migrationBuilder.DeleteData(
                table: "ServiceType",
                keyColumn: "ServiceTypeID",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "ServiceType",
                keyColumn: "ServiceTypeID",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "ServiceType",
                keyColumn: "ServiceTypeID",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "ServiceType",
                keyColumn: "ServiceTypeID",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "ServiceType",
                keyColumn: "ServiceTypeID",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "ServiceType",
                keyColumn: "ServiceTypeID",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "ServiceType",
                keyColumn: "ServiceTypeID",
                keyValue: 7);
        }
    }
}