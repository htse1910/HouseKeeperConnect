using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTOs
{
    public class JobUpdateDTO
    {
        public int JobID { get; set; }

        public string JobName { get; set; }

        public int FamilyID { get; set; }
        public int Status { get; set; }
        [Required]
        public int JobType { get; set; }

        // JobDetail fields
        public string Location { get; set; }

        public decimal? Price { get; set; }

        public int? ServiceID { get; set; }

        public DateTime? StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string Description { get; set; }
        public int? StartSlot { get; set; }

        public int? EndSlot { get; set; }
        public int? HousekeeperID { get; set; }
    }
}