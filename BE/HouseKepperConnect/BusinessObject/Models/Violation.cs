using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class Violation
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ViolationID { get; set; }
        public int HouseKeeperID { get; set; }
        public int Times {  get; set; }

    }
}
