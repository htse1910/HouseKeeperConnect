using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class AccountUpdateDTO
    {
        [Required]
        public int AccountID { get; set; }

        [Required(ErrorMessage = "Full Name is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }

        [RegularExpression("^[0-9]*$", ErrorMessage = "Bank number must be numeric.")]
        public long BankAccountNumber { get; set; }

        [Required(ErrorMessage = "Phone is required.")]
        public int Phone { get; set; }
        [Required(ErrorMessage = "Nickname is required.")]
        public string? Nickname { get; set; }
    }
}