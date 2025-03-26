using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class HousekeeperSkillCreateDTO
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [StringLength(255)]
        public string Description { get; set; }
    }
}