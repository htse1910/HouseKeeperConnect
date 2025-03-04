using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class ScheduleType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ScheduleTypeID { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
    }
}