using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class BookingDisplayDTO
    {

        [Required]
        public int JobID { get; set; }

        [Required]
        public int HousekeeperID { get; set; }

        [Required]
        public int FamilyID { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public int BookingStatus { get; set; }
    }
}
