using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Housekeeper
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int HousekeeperID { get; set; }

        [ForeignKey("Account")]
        public int AccountID { get; set; }

        public int? Rating { get; set; }

        public bool IsVerified { get; set; } = false;

        public int JobCompleted { get; set; } = 0;

        public int JobsApplied { get; set; } = 0;

        [ForeignKey("IDVerification")]
        public int? VerifyID { get; set; }

        public virtual Account Account { get; set; }

        public virtual IDVerification IDVerification { get; set; }
    }
}