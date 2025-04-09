using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Payout
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int PayoutID { get; set; }

        [Required]
        [ForeignKey("Booking")]
        public int BookingID { get; set; }

        [Required]
        [ForeignKey("Housekeeper")]
        public int HousekeeperID { get; set; }

        public decimal Amount { get; set; }
        public DateTime PayoutDate { get; set; } = DateTime.Now;
        public int Status { get; set; }

        public virtual Housekeeper Housekeeper { get; set; }
        public virtual Booking Booking { get; set; }
    }
}