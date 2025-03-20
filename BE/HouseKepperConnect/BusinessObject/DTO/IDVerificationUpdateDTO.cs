using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class IDVerificationUpdateDTO
    {
        [Required]
        public int VerifyID { get; set; }

        public int? IDNumber { get; set; }
        public string? RealName { get; set; }
        public DateTime? DateOfBirth { get; set; }

        public IFormFile? FrontPhoto { get; set; }
        public IFormFile? BackPhoto { get; set; }
        public IFormFile? FacePhoto { get; set; }
    }
}