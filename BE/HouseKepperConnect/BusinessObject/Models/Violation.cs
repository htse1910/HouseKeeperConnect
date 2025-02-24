using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Violation
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ViolationID { get; set; }

        public int HouseKeeperID { get; set; }
        public int Times { get; set; }
        public string Description { get; set; }
    }
}