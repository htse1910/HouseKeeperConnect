using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Job
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int JobID { get; set; }

        [ForeignKey("Family")]
        public int FamilyID { get; set; }

        [Required, MaxLength(255)]
        public string JobName { get; set; }

        public int Status { get; set; }

        [Required]
        public int JobType { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime UpdatedDate { get; set; } = DateTime.Now;

        public virtual Family Family { get; set; }
        public virtual Booking Booking { get; set; }
        public virtual Payment Payment { get; set; }
        public virtual JobDetail JobDetail { get; set; }
        public virtual ICollection<Job_Service> Job_Services { get; set; }
        public virtual ICollection<Job_Slots> Job_Slots { get; set; }
        public virtual ICollection<Application> Applications { get; set; }
    }
}