using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class Job_SlotsCreateDTO
    {
        [Required]
        public int JobID { get; set; }

        [Required]
        public int SlotID { get; set; }

        [Required]
        [Range(0, 6, ErrorMessage = "DayOfWeek must be between 0 (Sunday) and 6 (Saturday).")]
        public int DayOfWeek { get; set; }
    }
}