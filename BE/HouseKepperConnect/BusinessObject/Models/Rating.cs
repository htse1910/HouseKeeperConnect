using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.Models
{
    public class Rating
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RatingID { get; set; }

        [ForeignKey("Family")]
        public int FamilyID { get; set; }

        [ForeignKey("HouseKeeper")]
        public int HouseKeeperID { get; set; }

        [Required]
        [MaxLength(500)]
        public string Content { get; set; }

        [Range(1, 5)]
        public int Score { get; set; }

        [Required]
        public DateTime CreateAt { get; set; }

        public virtual Family Family { get; set; }
        public virtual Housekeeper Housekeeper { get; set; }
    }
}
