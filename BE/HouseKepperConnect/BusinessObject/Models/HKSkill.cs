using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class HKSkill
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int HKSkillID { get; set; }

        public string Name { get; set; }
    }
}