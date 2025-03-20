using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Booking_WorkingDays_Slots
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Booking_WorkingDays_SlotsId { get; set; }

        public int BookingID { get; set; }
        public int WorkingDaysID { get; set; }
        public int SlotID { get; set; }
        public virtual Booking Booking { get; set; }
        public virtual WorkingDays WorkingDays { get; set; }
        public virtual Slot Slot { get; set; }
    }
}