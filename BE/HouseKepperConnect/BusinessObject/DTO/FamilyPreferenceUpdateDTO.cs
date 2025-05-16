using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class FamilyPreferenceUpdateDTO
    {
        [Required]
        public int FamilyPreferenceID { get; set; }

        [Required]
        public int FamilyID { get; set; }

        [Required]
        public int GenderPreference { get; set; }

        [Required]
        public int LanguagePreference { get; set; }

        [Required]
        public int LocationPreference { get; set; }
    }
}
