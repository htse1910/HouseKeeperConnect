using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class FamilyPreferenceSkillCreateDTO
    {
        [Required]
        public int FamilyPreferenceID { get; set; }

        [Required]
        public int HouseKeeperSkillID { get; set; }
    }
}