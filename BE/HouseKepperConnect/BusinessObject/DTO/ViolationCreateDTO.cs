using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class ViolationCreateDTO
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }
    }
}