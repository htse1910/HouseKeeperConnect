using System;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTOs
{
    public class BookingCreateDTO
    {
        [Required]
        public int JobID { get; set; }

        [Required]
        public int HousekeeperID { get; set; }

        [Required]
        public int FamilyID { get; set; }

        [Required]
        public int ServiceID { get; set; }

        [Required]
        public DateTime ScheduledDate { get; set; }

        [Required]
        public int BookingStatus { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }
    }
}