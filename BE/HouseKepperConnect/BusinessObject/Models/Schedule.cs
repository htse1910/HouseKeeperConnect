using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Schedule
    {
        [Key]
        public int ScheduleID { get; set; }

        [ForeignKey("Housekeeper")]
        public int HousekeeperID { get; set; }

        [ForeignKey("Slot")]
        public int SlotID { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public int Status { get; set; }

        public virtual Housekeeper Housekeeper { get; set; }
        public virtual Slot Slot { get; set; }
    }
}