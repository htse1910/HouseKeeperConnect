using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
