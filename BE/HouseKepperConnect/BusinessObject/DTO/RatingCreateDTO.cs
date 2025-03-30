using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class RatingCreateDTO
    {
        public int Reviewer { get; set; }

        public int Reviewee { get; set; }

        [Required]
        [MaxLength(500)]
        public string Content { get; set; }

        [Range(1, 5)]
        [Required]
        public int Score { get; set; }
    }
}