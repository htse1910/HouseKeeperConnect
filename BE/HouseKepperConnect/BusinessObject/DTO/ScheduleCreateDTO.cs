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
        public DateTime Date { get; set; }

        [Required]
        public int ScheduleTypeID { get; set; }

        [Required]
        public int Status { get; set; }
    }
}