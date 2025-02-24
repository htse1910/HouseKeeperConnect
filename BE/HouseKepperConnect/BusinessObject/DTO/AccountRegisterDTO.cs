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

        [Required(ErrorMessage = "Phone is required.")]
        public int Phone { get; set; }
    }
}