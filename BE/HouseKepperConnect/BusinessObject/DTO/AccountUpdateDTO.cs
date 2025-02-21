using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class AccountUpdateDTO
    {
        [Required]
        public int AccountID { get; set; }

        [Required(ErrorMessage = "Full Name is required.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "RoleID is required.")]
        public int RoleID { get; set; }

        [Required(ErrorMessage = "Phone is required.")]
        public int Phone { get; set; }

        [Required(ErrorMessage = "Status is required.")]
        public int Status { get; set; }
    }
}