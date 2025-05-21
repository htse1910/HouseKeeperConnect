using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BusinessObject.Models.Enum;

namespace BusinessObject.DTO
{
    public class ScheduleWeekDTO
    {
        public int Booking_SlotsId { get; set; }

        public int BookingID { get; set; }

        [Range(0, 6)]
        public int DayOfWeek { get; set; }
        public string JobName { get; set; }

        public int SlotID { get; set; }
        public DateTime? Date { get; set; }
        public bool IsCheckedIn { get; set; }
        public DateTime? CheckInTime { get; set; } // optional, for logging exact time
        public bool IsConfirmedByFamily { get; set; }
        public BookingSlotStatus Status { get; set; } // default to Active
        public DateTime? ConfirmedAt { get; set; }// optional
    }
}
