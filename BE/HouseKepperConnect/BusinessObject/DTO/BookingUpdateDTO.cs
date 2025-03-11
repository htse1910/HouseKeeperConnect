using System;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTOs
{
    public class BookingUpdateDTO
    {
        [Required]
        public int BookingID { get; set; }

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
    }
}
