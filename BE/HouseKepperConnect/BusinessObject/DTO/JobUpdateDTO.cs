using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class JobUpdateDTO
    {
        [Required]
        public int JobID { get; set; } // Required to identify the job to update

        // Job fields

        [Required]
        [StringLength(255, ErrorMessage = "Job name cannot exceed 255 characters.")]
        public string JobName { get; set; }

        // JobDetail fields
        [Required]
        [StringLength(255, ErrorMessage = "Location cannot exceed 255 characters.")]
        public string Location { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be at least 0.")]
        public decimal Price { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public string Description { get; set; }

        [Required]
        public bool IsOffered { get; set; }

        public int? HousekeeperID { get; set; }

        [Required]
        public int Status { get; set; }
    }
}