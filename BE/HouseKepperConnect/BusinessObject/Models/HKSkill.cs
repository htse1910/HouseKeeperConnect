using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class HKSkill
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int HKSkillID { get; set; }
        public string Name { get; set; }
    }
}
