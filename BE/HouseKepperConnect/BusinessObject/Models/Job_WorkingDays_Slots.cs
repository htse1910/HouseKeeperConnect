using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Job_WorkingDays_Slots
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Job_WorkingDays_SlotsId { get; set; }

        public int DayID { get; set; }
        public int SlotID { get; set; }
        public int JobID { get; set; }
        public virtual WorkingDays WorkingDays { get; set; }
        public virtual Slot Slot { get; set; }
        public virtual Job Job { get; set; }
    }
}