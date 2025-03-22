using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Booking_Slots
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Booking_SlotsId { get; set; }

        public int BookingID { get; set; }

        [Range(0, 6)]
        public int DayOfWeek { get; set; }

        public int SlotID { get; set; }
        public virtual Booking Booking { get; set; }
        public virtual Slot Slot { get; set; }
    }
}