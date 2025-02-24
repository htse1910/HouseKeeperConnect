using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class JobDetail
    {

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int JobDetailID { get; set; }

        [Required]
        public int JobID { get; set; }

        [Required]
        [StringLength(100)]
        public string Frequency { get; set; }

        [Required]
        [StringLength(255)]
        public string Location { get; set; }

        [Required]
        public int ServiceID { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public int StartSlot { get; set; }

        [Required]
        public int EndSlot { get; set; }

        [ForeignKey("JobID")]
        public virtual Job Job { get; set; }

        [ForeignKey("ServiceID")]
        public virtual Service Service { get; set; }
    }
}