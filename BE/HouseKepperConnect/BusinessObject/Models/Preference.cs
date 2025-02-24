using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.Models
{
    public class Preference
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PreferenceID { get; set; }

        [ForeignKey("Gender")]
        public int? GenderID { get; set; }

        [ForeignKey("Language")]
        public int? LanguageID { get; set; }

        [ForeignKey("HouseKeeperSkill")]
        public int? SkillID { get; set; }

        public virtual Gender Gender { get; set; }
        public virtual Language Language { get; set; }
        public virtual HouseKeeperSkill HouseKeeperSkill { get; set; }
    }
}
