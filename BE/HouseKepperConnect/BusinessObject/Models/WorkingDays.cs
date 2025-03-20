using System.ComponentModel.DataAnnotations;

namespace BusinessObject.Models
{
    public class WorkingDays
    {
        [Key]
        public int DayID { get; set; }

        [StringLength(30)]
        public string Name { get; set; }
    }
}