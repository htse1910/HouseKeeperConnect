using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class Job_ServiceCreateDTO
    {
        [Required]
        public int JobID { get; set; }

        [Required]
        public int ServiceID { get; set; }
    }
}