using System.ComponentModel.DataAnnotations;

namespace BusinessObject.Models
{
    public class PlatformFee
    {
        [Key]
        public int FeeID { get; set; }

        [Required]
        [Range(0, 1)]
        public decimal Percent { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        [Required]
        public DateTime UpdatedDate { get; set; }

        public virtual IEnumerable<JobDetail> JobDetails { get; set; }
    }
}