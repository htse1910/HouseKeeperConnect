using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class Preference
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PreferenceID { get; set; }

        [ForeignKey("Gender")]
        public int? GenderID { get; set; }
        public Gender Gender { get; set; }

        [ForeignKey("Language")]
        public int? LanguageID { get; set; }
        public Language Language { get; set; }

        [ForeignKey("HouseKeeperSkill")]
        public int? SkillID { get; set; }
        public HouseKeeperSkill HouseKeeperSkill { get; set; }
    }
}
