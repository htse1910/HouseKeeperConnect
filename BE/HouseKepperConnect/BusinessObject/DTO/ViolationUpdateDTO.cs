using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class ViolationUpdateDTO
    {
        [Required]
        public int ViolationID { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }
    }
}