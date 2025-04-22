using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace BusinessObject.Models
{
    public class PCHWFDBContext : DbContext
    {
        public PCHWFDBContext()
        { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);
            IConfigurationRoot configuration = builder.Build();
            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
        }

        public virtual DbSet<Account> Account { get; set; }
        public virtual DbSet<Role> Role { get; set; }
        public virtual DbSet<Transaction> Transaction { get; set; }
        public virtual DbSet<Wallet> Wallet { get; set; }
        public virtual DbSet<Housekeeper> Housekeeper { get; set; }
        public virtual DbSet<HouseKeeperSkill> HouseKeeperSkill { get; set; }
        public virtual DbSet<Slot> Slot { get; set; }
        public virtual DbSet<IDVerification> IDVerification { get; set; }
        public virtual DbSet<Violation> Violation { get; set; }
        public virtual DbSet<Family> Family { get; set; }
        public virtual DbSet<Chat> Chat { get; set; }
        public virtual DbSet<Notification> Notification { get; set; }
        public virtual DbSet<Rating> Rating { get; set; }
        public virtual DbSet<Service> Service { get; set; }
        public virtual DbSet<ServiceType> ServiceType { get; set; }
        public virtual DbSet<Application> Application { get; set; }
        public virtual DbSet<Payment> Payment { get; set; }

        public virtual DbSet<Job> Job { get; set; }
        public virtual DbSet<JobDetail> JobDetail { get; set; }
        public virtual DbSet<Booking> Booking { get; set; }
        public virtual DbSet<Payout> Payout { get; set; }
        public virtual DbSet<HousekeeperSkillMapping> HousekeeperSkillMapping { get; set; }

        public virtual DbSet<VerificationTask> VerificationTask { get; set; }

        public virtual DbSet<Housekeeper_Violation> Housekeeper_Violation { get; set; }
        public virtual DbSet<Withdraw> Withdraw { get; set; }
        public virtual DbSet<Booking_Slots> Booking_Slots { get; set; }
        public virtual DbSet<Job_Service> Job_Service { get; set; }
        public virtual DbSet<Job_Slots> Job_Slots { get; set; }
        public virtual DbSet<SupportRequest> SupportRequests { get; set; }
        public virtual DbSet<PlatformFee> PlatformFee { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PlatformFee>().HasData(
                new PlatformFee { FeeID = 1, Percent = 0.1m }
                );

            modelBuilder.Entity<Role>().HasData(
                new Role { RoleID = 1, RoleName = "Housekeeper" },
                new Role { RoleID = 2, RoleName = "Family" },
                new Role { RoleID = 3, RoleName = "Staff" },
                new Role { RoleID = 4, RoleName = "Admin" }
                );

            modelBuilder.Entity<Slot>().HasData(
                new Slot { SlotID = 1, Time = "8H - 9H" },
                new Slot { SlotID = 2, Time = "9H - 10H" },
                new Slot { SlotID = 3, Time = "10H - 11H" },
                new Slot { SlotID = 4, Time = "11H - 12H" },
                new Slot { SlotID = 5, Time = "12H - 13H" },
                new Slot { SlotID = 6, Time = "13H - 14H" },
                new Slot { SlotID = 7, Time = "14H - 15H" },
                new Slot { SlotID = 8, Time = "15H - 16H" },
                new Slot { SlotID = 9, Time = "16H - 17H" },
                new Slot { SlotID = 10, Time = "17H - 18H" },
                new Slot { SlotID = 11, Time = "18H - 19H" },
                new Slot { SlotID = 12, Time = "19H - 20H" }
                );
            modelBuilder.Entity<ServiceType>().HasData(
                new ServiceType { ServiceTypeID = 1, ServiceTypeName = "Dọn dẹp nhà cửa" },
                new ServiceType { ServiceTypeID = 2, ServiceTypeName = "Chăm sóc trẻ em/người cao tuổi" },
                new ServiceType { ServiceTypeID = 3, ServiceTypeName = "Nấu ăn tại nhà" },
                new ServiceType { ServiceTypeID = 4, ServiceTypeName = "Giặt ủi & chăm sóc quần áo" },
                new ServiceType { ServiceTypeID = 5, ServiceTypeName = "Chăm sóc sân vườn & thú cưng" },
                new ServiceType { ServiceTypeID = 6, ServiceTypeName = "Dịch vụ sửa chữa & bảo trì nhà cửa" },
                new ServiceType { ServiceTypeID = 7, ServiceTypeName = "Hỗ trợ đặc biệt" }
                );
            modelBuilder.Entity<Service>().HasData(
    new Service { ServiceID = 1, ServiceName = "Dọn dẹp", ServiceTypeID = 1, Price = 75000, Description = "" },
    new Service { ServiceID = 2, ServiceName = "Tổng vệ sinh nhà cửa", ServiceTypeID = 1, Price = 120000, Description = "" },
    new Service { ServiceID = 3, ServiceName = "Dọn dẹp sau sự kiện/tết", ServiceTypeID = 1, Price = 150000, Description = "" },
    new Service { ServiceID = 4, ServiceName = "Giữ trẻ tại nhà nguyên ngày", ServiceTypeID = 2, Price = 95000, Description = "" },
    new Service { ServiceID = 5, ServiceName = "Chăm sóc người cao tuổi tại nhà", ServiceTypeID = 2, Price = 95000, Description = "" },
    new Service { ServiceID = 6, ServiceName = "Nấu ăn theo bữa", ServiceTypeID = 3, Price = 85000, Description = "" },
    new Service { ServiceID = 7, ServiceName = "Nấu ăn theo tuần/tháng", ServiceTypeID = 3, Price = 85000, Description = "" },
    new Service { ServiceID = 8, ServiceName = "Giặt ủi", ServiceTypeID = 4, Price = 30000, Description = "" },
    new Service { ServiceID = 9, ServiceName = "Ủi quần áo", ServiceTypeID = 4, Price = 10000, Description = "" },
    new Service { ServiceID = 10, ServiceName = "Giặt hấp cao cấp", ServiceTypeID = 4, Price = 60000, Description = "" },
    new Service { ServiceID = 11, ServiceName = "Chăm sóc cây cảnh", ServiceTypeID = 5, Price = 75000, Description = "" },
    new Service { ServiceID = 12, ServiceName = "Tưới cây, cắt tỉa", ServiceTypeID = 5, Price = 65000, Description = "" },
    new Service { ServiceID = 13, ServiceName = "Tắm & cắt tỉa lông thú cưng", ServiceTypeID = 5, Price = 100000, Description = "" },
    new Service { ServiceID = 14, ServiceName = "Sửa chữa điện nước", ServiceTypeID = 6, Price = 120000, Description = "" },
    new Service { ServiceID = 15, ServiceName = "Sơn sửa nội thất nhỏ", ServiceTypeID = 6, Price = 130000, Description = "" },
    new Service { ServiceID = 16, ServiceName = "Thợ sửa chữa", ServiceTypeID = 6, Price = 150000, Description = "" },
    new Service { ServiceID = 17, ServiceName = "Giúp việc theo yêu cầu (dịch vụ VIP)", ServiceTypeID = 7, Price = 180000, Description = "" },
    new Service { ServiceID = 18, ServiceName = "Hỗ trợ vận chuyển đồ đạc nhẹ", ServiceTypeID = 7, Price = 100000, Description = "" }
);
        }
    }
}