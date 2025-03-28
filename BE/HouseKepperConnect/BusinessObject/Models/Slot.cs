using System.ComponentModel.DataAnnotations;

namespace BusinessObject.Models
{
    public class Slot
    {
        [Key]
        public int SlotID { get; set; }

        [Required]
        public string Time { get; set; }
    }
}