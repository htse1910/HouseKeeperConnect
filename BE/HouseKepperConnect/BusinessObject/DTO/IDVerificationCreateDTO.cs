using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class IDVerificationCreateDTO
    {
        public int? IDNumber { get; set; }
        public string? RealName { get; set; }
        public DateTime? DateOfBirth { get; set; }

        [Required]
        public IFormFile FrontPhoto { get; set; }

        [Required]
        public IFormFile BackPhoto { get; set; }

        [Required]
        public IFormFile FacePhoto { get; set; }
    }
}