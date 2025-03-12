using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class AdminUpdateAccountDTO
    {
        [Required]
        public int AccountID { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Phone is required.")]
        public int Status { get; set; }
    }
}