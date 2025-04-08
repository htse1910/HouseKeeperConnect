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
        public bool IsCheckedIn { get; set; } = false;
        public DateTime? CheckInTime { get; set; } // optional, for logging exact time
        public bool IsConfirmedByFamily { get; set; } = false;
        public DateTime? ConfirmedAt { get; set; } // optional
        public virtual Booking Booking { get; set; }
        public virtual Slot Slot { get; set; }
    }
}