using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace BusinessObject.DTO
{
    public class AccountStaffCreateDTO
    {
        [Required(ErrorMessage = "Full Name is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }

        /*[RegularExpression("^[0-9]*$", ErrorMessage = "Bank number must be numeric.")]
        public string BankAccountNumber { get; set; }*/

        [Required(ErrorMessage = "Phone is required.")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Gender is required.")]
        public int? Gender { get; set; }
    }
}
