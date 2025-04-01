using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class JobListing_Application
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int JobListingApplicationID { get; set; }

        [Required]
        public int JobID { get; set; }

        [Required]
        public int ApplicationID { get; set; }

        public virtual Job Job { get; set; }

        public virtual Application Application { get; set; }
    }
}