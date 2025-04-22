using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace BusinessObject.DTO
{
    public class IDVerificationUpdateDTO
    {
        [Required]
        public int VerifyID { get; set; }

        public IFormFile? FrontPhoto { get; set; }
        public IFormFile? BackPhoto { get; set; }
        public IFormFile? FacePhoto { get; set; }
    }
}