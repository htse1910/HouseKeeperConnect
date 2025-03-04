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

        [ForeignKey("HouseKeeperSkill")]
        public int HouseKeeperSkillID { get; set; }

        [ForeignKey("Violation")]
        public int? ViolationID { get; set; }

        public int? Rating { get; set; }

        public bool IsVerified { get; set; }
        public string BankAccountNumber { get; set; }

        public int JobCompleted { get; set; }

        public int JobsApplied { get; set;}

        [ForeignKey("IDVerification")]
        public int? VerifyID { get; set; }

        public virtual Account Account { get; set; }
        public virtual HouseKeeperSkill HouseKeeperSkill { get; set; }
        public virtual Violation Violation { get; set; }
        public virtual IDVerification IDVerification { get; set; }
    }
}
