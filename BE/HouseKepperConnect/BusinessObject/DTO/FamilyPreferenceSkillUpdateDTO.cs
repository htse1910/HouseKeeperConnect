using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class FamilyPreferenceSkillUpdateDTO
    {
        [Required]
        public int FamilyPreferenceSkillID { get; set; }

        [Required]
        public int FamilyPreferenceID { get; set; }

        [Required]
        public int HouseKeeperSkillID { get; set; }
    }
}
