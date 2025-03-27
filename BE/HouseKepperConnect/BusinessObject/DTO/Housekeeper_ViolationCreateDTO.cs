using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class Housekeeper_ViolationCreateDTO
    {
        [Required]
        public int HousekeeperID { get; set; }

        [Required]
        public int ViolationID { get; set; }
    }
}
