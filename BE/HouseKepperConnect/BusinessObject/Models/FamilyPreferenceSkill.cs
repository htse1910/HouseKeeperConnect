using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class FamilyPreferenceSkill
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int FamilyPreferenceSkillID {  get; set; }
        [ForeignKey("FamilyPreference")]
        public int FamilyPreferenceID { get; set; }
        [ForeignKey("HouseKeeperSkill")]
        public int HouseKeeperSkillID {  get; set; }
        public virtual FamilyPreference FamilyPreference { get; set; }
        public virtual HouseKeeperSkill HouseKeeperSkill { get; set; }
    }
}
