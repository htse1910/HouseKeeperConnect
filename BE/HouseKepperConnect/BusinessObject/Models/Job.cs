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
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public virtual Family Family { get; set; }
        public virtual ICollection<Job_Service> Job_Services { get; set; } = new List<Job_Service>();
        public virtual ICollection<Job_Slots> Job_Slots { get; set; } = new List<Job_Slots>();
    }
}