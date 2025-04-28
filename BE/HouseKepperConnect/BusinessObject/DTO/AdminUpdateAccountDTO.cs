using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class AdminUpdateAccountDTO
    {

        [Required(ErrorMessage = "Password is required.")]
        public string Password { get; set; }
        [Range(1, int.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public int RoleID { get; set; }
    }
}