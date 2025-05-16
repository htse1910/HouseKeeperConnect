using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class FamilyPreferenceCreateDTO
    {
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
