using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Housekeeper
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int HouseKeeperID { get; set; }

        [ForeignKey("Account")]
        public int AccountID { get; set; }
        public Account Account { get; set; }

        [ForeignKey("HouseKeeperSkill")]
        public int HouseKeeperSkillID { get; set; }
        public HouseKeeperSkill HouseKeeperSkill { get; set; }

        [ForeignKey("Violation")]
        public int? ViolationID { get; set; }
        public Violation Violation { get; set; }

        [StringLength(255)]
        public string Review { get; set; }

        public int? Rating { get; set; }

        public bool IsVerified { get; set; }

        public int JobCompleted { get; set; }

        [ForeignKey("IDNumber")]
        public int IDNumber { get; set; }
        public IDNumber IDNumberEntity { get; set; }
    }
}