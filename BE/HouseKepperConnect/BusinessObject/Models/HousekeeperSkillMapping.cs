using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class HousekeeperSkillMapping
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int HousekeeperSkillMappingID { get; set; }

        [ForeignKey("Housekeeper")]
        public int HousekeeperID { get; set; }

        [ForeignKey("HouseKeeperSkill")]
        public int HouseKeeperSkillID { get; set; }

        public virtual Housekeeper Housekeeper { get; set; }
        public virtual HouseKeeperSkill HouseKeeperSkill { get; set; }
    }
}
