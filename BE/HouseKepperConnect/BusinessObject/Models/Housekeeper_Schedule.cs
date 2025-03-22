using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Housekeeper_Schedule
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Housekeeper_ScheduleID { get; set; }

        [ForeignKey("Housekeeper")]
        public int HousekeeperID { get; set; }

        [ForeignKey("Slot")]
        public int SlotID { get; set; }

        public int DayOfWeek { get; set; }
        public virtual Housekeeper Housekeeper { get; set; }
        public virtual Slot Slot { get; set; }
    }
}