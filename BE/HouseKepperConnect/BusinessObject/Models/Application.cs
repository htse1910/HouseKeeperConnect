using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Application
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ApplicationID { get; set; }
        public int JobID { get; set; }

        public int HouseKeeperID { get; set; }
        public int Status { get; set; }
        public virtual Job Job { get; set; }

        public virtual Housekeeper HouseKepper { get; set; }
    }
}