using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class Housekeeper_ViolationCreateDTO
    {
        [Required]
        public int HousekeeperID { get; set; }

        [Required]
        public int ViolationID { get; set; }
    }
}