using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class HousekeeperSkillUpdateDTO
    {
        [Required]
        public int HouseKeeperSkillID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(255)]
        public string Description { get; set; }
    }
}