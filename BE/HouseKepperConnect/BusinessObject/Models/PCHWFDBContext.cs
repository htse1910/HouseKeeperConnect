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
        public virtual DbSet<Report> Report { get; set; }
        public virtual DbSet<Notification> Notification { get; set; }
        public virtual DbSet<Rating> Rating { get; set; }
        public virtual DbSet<Service> Service { get; set; }
        public virtual DbSet<ServiceType> ServiceType { get; set; }
        public virtual DbSet<Application> Application { get; set; }
        public virtual DbSet<Payment> Payment { get; set; }

        public virtual DbSet<Job> Job { get; set; }
        public virtual DbSet<JobDetail> JobDetail { get; set; }
        public virtual DbSet<JobListing_Application> JobListing_Application { get; set; }
        public virtual DbSet<Family_Service> Family_Service { get; set; }
        public virtual DbSet<Booking> Booking { get; set; }
        public virtual DbSet<Payout> Payout { get; set; }
        public virtual DbSet<HousekeeperSkillMapping> HousekeeperSkillMapping { get; set; }

        public virtual DbSet<VerificationTask> VerificationTask { get; set; }

        public virtual DbSet<Housekeeper_Violation> Housekeeper_Violation { get; set; }
        public virtual DbSet<WorkingDays> WorkingDays { get; set; }
        public virtual DbSet<Withdraw> Withdraw { get; set; }
        public virtual DbSet<Booking_WorkingDays_Slots> Booking_WorkingDays_Slots { get; set; }
        public virtual DbSet<Job_Service> Job_Service { get; set; }
        public virtual DbSet<Job_WorkingDays_Slots> Job_WorkingDays_Slots { get; set; }
        public virtual DbSet<Housekeeper_Schedule> Housekeeper_Schedule { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleID = 1, RoleName = "HouseKeeper" },
                new Role { RoleID = 2, RoleName = "Family" },
                new Role { RoleID = 3, RoleName = "Staff" },
                new Role { RoleID = 4, RoleName = "Admin" }
                );
            modelBuilder.Entity<WorkingDays>().HasData(
                new WorkingDays { DayID = 1, Name = "Monday" },
                new WorkingDays { DayID = 2, Name = "Tuesday" },
                new WorkingDays { DayID = 3, Name = "Wednesday" },
                new WorkingDays { DayID = 4, Name = "Thursday" },
                new WorkingDays { DayID = 5, Name = "Friday" },
                new WorkingDays { DayID = 6, Name = "Saturday" },
                new WorkingDays { DayID = 7, Name = "Sunday" }
                );
        }
    }
}