using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class ScheduleCreateDTO
    {
        [Required]
        public int HousekeeperID { get; set; }

        [Required]
        public int SlotID { get; set; }

        [Required]
        public int WorkingDaysID { get; set; }
    }
}