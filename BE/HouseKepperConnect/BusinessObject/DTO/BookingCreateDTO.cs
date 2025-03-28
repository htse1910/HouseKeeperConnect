using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class BookingCreateDTO
    {
        [Required]
        public int JobID { get; set; }

        [Required]
        public int HousekeeperID { get; set; }
    }
}