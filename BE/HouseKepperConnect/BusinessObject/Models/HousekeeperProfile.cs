using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class HousekeeperProfile
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int HouseKeeperProfileID { get; set; }
        public int AccountID { get; set; }
        
    }
}
