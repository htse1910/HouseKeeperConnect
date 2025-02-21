using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class AccountDisplayDTO
    {
        public int UserID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string RoleID { get; set; }

        [Phone]
        public string Phone { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }

        public int Status { get; set; }
    }
}