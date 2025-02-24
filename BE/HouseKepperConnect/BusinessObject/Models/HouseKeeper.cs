using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Housekeeper
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int HouseKeeperProfileID { get; set; }

        public int AccountID { get; set; }
    }
}