using System.ComponentModel.DataAnnotations;

namespace BusinessObject.Models
{
    public class ServiceType
    {
        [Key]
        public int ServiceTypeID { get; set; }

        [Required]
        [MaxLength(100)]
        public string ServiceTypeName { get; set; }
    }
}