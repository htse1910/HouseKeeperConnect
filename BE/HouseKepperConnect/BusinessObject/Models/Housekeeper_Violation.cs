using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Housekeeper_Violation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int HousekeeperViolationID { get; set; }

        [ForeignKey("Housekeeper")]
        public int HousekeeperID { get; set; }

        [ForeignKey("Violation")]
        public int ViolationID { get; set; }

        public DateTime ViolationDate { get; set; }

        public virtual Housekeeper Housekeeper { get; set; }
        public virtual Violation Violation { get; set; }
    }
}