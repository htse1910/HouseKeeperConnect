using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class ServiceCreateDTO
    {
        [Required]
        [StringLength(100, ErrorMessage = "Service name cannot exceed 100 characters.")]
        public string ServiceName { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be at least 0.")]
        public decimal Price { get; set; }

        [Required]
        public int ServiceTypeID { get; set; }

        [StringLength(255, ErrorMessage = "Description cannot exceed 255 characters.")]
        public string Description { get; set; }
    }
}