using System.ComponentModel.DataAnnotations;

namespace BusinessObject.Models
{
    public class Service
    {
        [Key]
        public int ServiceID { get; set; }

        [Required]
        [MaxLength(100)]
        public string ServiceName { get; set; }

        [Required]
        public decimal Price { get; set; }

        public int ServiceTypeID { get; set; }

        [MaxLength(255)]
        public string Description { get; set; }

        public virtual ServiceType ServiceType { get; set; }
    }
}