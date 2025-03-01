using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Violation
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ViolationID { get; set; }

        [ForeignKey("Housekeeper")]
        public int HouseKeeperID { get; set; }

        [Required]
        public int Times { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        public virtual Housekeeper Housekeeper { get; set; }
    }
}
