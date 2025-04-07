using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTOs
{
    public class JobUpdateDTO
    {
        [Required]
        public int JobID { get; set; }
        [Required]
        public string JobName { get; set; }
        [Required]
        public int Status { get; set; }

        // JobDetail fields
        [Required]
        public decimal Price { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }

        public string? Description { get; set; }
        public int? HousekeeperID { get; set; }
    }
}