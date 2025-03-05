using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class IDVerificationDTO
    {
        [Required]
        public IFormFile FrontPhoto { get; set; }

        [Required]
        public IFormFile BackPhoto { get; set; }

        [Required]
        public IFormFile FacePhoto { get; set; }
    }
}