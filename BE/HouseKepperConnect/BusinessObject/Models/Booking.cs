using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Booking
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BookingID { get; set; }

        [ForeignKey("Job")]
        public int JobID { get; set; }

        [ForeignKey("Housekeeper")]
        public int HousekeeperID { get; set; }

        [ForeignKey("Family")]
        public int FamilyID { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        public int BookingStatus { get; set; }

        public virtual Job Job { get; set; }
        public virtual Housekeeper Housekeeper { get; set; }
        public virtual Family Family { get; set; }
    }
}