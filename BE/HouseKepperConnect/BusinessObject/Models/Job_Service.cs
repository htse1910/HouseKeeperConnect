using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Job_Service
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Job_ServiceId { get; set; }

        public int JobID { get; set; }
        public int ServiceID { get; set; }
        public virtual Job Job { get; set; }
        public virtual Service Service { get; set; }
    }
}