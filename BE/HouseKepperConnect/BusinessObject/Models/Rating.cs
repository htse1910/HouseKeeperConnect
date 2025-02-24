using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class Rating
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RatingID { get; set; }

        [ForeignKey("Family")]
        public int FamilyID { get; set; }
        public Family Family { get; set; }

        [ForeignKey("HouseKeeper")]
        public int HouseKeeperID { get; set; }
        public Housekeeper Housekeeper {  get; set; } 

        [Required]
        [MaxLength(500)]
        public string Content { get; set; }

        [Range(1, 5)]
        public int Score { get; set; }

        [Required]
        public DateTime CreateAt { get; set; }
    }
}
