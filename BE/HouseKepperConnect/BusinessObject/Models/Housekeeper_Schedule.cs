using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Housekeeper_Schedule
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Housekeeper_ScheduleID { get; set; }

        public int HousekeeperID { get; set; }
        public int SlotID { get; set; }
        public int WorkingDaysID { get; set; }
        public virtual Housekeeper Housekeeper { get; set; }
        public virtual Slot Slot { get; set; }
        public virtual WorkingDays WorkingDays { get; set; }
    }
}