using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class AccountRegisterDTO
    {
        [Required(ErrorMessage = "Full Name is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }

        [RegularExpression("^[0-9]*$", ErrorMessage = "Bank number must be numeric.")]
        public string BankAccountNumber { get; set; }

        [Required(ErrorMessage = "Phone is required.")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Role is required.")]
        public int RoleID { get; set; }

        [Required(ErrorMessage = "Introduce is required.")]
        public string? Introduction { get; set; }

        [Required(ErrorMessage = "LocalProfilePicture is required.")]
        public IFormFile LocalProfilePicture { get; set; }

        [Required(ErrorMessage = "Address is required.")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Gender is required.")]
        public int? Gender { get; set; }

        [Required(ErrorMessage = "Nickname is required.")]
        public string? Nickname { get; set; }
    }
}