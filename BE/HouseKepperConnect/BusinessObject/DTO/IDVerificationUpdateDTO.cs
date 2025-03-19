using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
