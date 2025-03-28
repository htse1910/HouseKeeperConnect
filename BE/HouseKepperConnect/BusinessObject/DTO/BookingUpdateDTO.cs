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
        public int Status { get; set; }
    }
}