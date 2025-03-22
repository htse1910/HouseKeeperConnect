using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class ScheduleUpdateDTO
    {
        [Required]
        public int Housekeeper_ScheduleID { get; set; }

        [Required]
        public int HousekeeperID { get; set; }

        [Required]
        public int SlotID { get; set; }

        [Required]
        public int WorkingDaysID { get; set; }
    }
}