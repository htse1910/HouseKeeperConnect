using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.DTO
{
    public class OTPVerificationDTO
    {
        [Required]
        public int WithdrawID { get; set; }

        [Required]
        [StringLength(6, MinimumLength = 6)]
        [RegularExpression("^[0-9]*$", ErrorMessage = "OTP must be numeric.")]
        public string OTPCode { get; set; }
    }
}
