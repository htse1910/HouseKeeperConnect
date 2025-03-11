using System;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class JobCreateDTO
    {
        // Job fields
        [Required]
        public int AccountID { get; set; }

        [Required]
        [StringLength(255, ErrorMessage = "Job name cannot exceed 255 characters.")]
        public string JobName { get; set; }

        // JobDetail fields
        [Required]
        [StringLength(100, ErrorMessage = "Frequency cannot exceed 100 characters.")]
        public string Frequency { get; set; }

        [Required]
        [StringLength(255, ErrorMessage = "Location cannot exceed 255 characters.")]
        public string Location { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be at least 0.")]
        public decimal Price { get; set; }

        [Required]
        public int ServiceID { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public string Description { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Start slot must be a positive integer.")]
        public int StartSlot { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "End slot must be a positive integer.")]
        public int EndSlot { get; set; }
    }
}
