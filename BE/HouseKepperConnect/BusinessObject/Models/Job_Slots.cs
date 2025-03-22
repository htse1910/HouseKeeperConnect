using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Job_Slots
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Job_SlotsId { get; set; }

        [Range(0, 6)]
        public int DayOfWeek { get; set; }

        [ForeignKey("Slot")]
        public int SlotID { get; set; }

        public int JobID { get; set; }
        public virtual Slot Slot { get; set; }
        public virtual Job Job { get; set; }
    }
}