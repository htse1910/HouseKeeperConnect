using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class Booking
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int BookingID { get; set; }

        [ForeignKey("Job")]
        public int JobID { get; set; }

        [ForeignKey("Housekeeper")]
        public int HousekeeperID { get; set; }

        [Required]
        public DateTime ScheduledDate { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; }

        [Required]
        [MaxLength(50)]
        public string BookingStatus { get; set; }
    }
}
