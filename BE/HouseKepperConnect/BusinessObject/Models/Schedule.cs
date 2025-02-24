using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.Models
{
    public class Schedule
    {

        [Key]
        public int ScheduleID { get; set; }

        [ForeignKey("Housekeeper")]
        public int HousekeeperID { get; set; }
        public virtual Housekeeper Housekeeper { get; set; }

        [ForeignKey("Slot")]
        public int SlotID { get; set; }
        public virtual Slot Slot { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [ForeignKey("ScheduleType")]
        public int ScheduleTypeID { get; set; }
        public virtual ScheduleType ScheduleType { get; set; }

        [Required]
        public int Status { get; set; }
    }
}