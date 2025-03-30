using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class RatingDisplayDTO
    {
        public int RatingID { get; set; }

        public int FamilyID { get; set; }

        public int HouseKeeperID { get; set; }

        [Required]
        [MaxLength(500)]
        public string Content { get; set; }

        [Range(1, 5)]
        public int Score { get; set; }

        [Required]
        public DateTime CreateAt { get; set; }
    }
}
