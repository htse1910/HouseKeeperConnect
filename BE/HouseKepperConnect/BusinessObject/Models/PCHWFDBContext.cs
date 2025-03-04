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
        public virtual DbSet<Schedule> Schedule { get; set; }
        public virtual DbSet<ScheduleType> ScheduleType { get; set; }
        public virtual DbSet<Slot> Slot { get; set; }
        public virtual DbSet<IDVerification> IDVerification { get; set; }
        public virtual DbSet<Violation> Violation { get; set; }
        public virtual DbSet<Family> Family { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Role>().HasData(
                new Role { RoleID = 1, RoleName = "HouseKeeper" },
                new Role { RoleID = 2, RoleName = "Family" },
                new Role { RoleID = 3, RoleName = "Staff" },
                new Role { RoleID = 4, RoleName = "Admin" }
                );
        }
    }
}