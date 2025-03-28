using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class BookingDisplayDTO
    {
        [Required]
        public int JobID { get; set; }

        [Required]
        public int HousekeeperID { get; set; }

        [Required]
        public int FamilyID { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public int Status { get; set; }
    }
}