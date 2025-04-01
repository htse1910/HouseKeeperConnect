using System.ComponentModel.DataAnnotations;
using BusinessObject.Models.Enum;

namespace BusinessObject.DTO
{
    public class AccountDisplayDTO
    {
        public int AccountID { get; set; }

        public string Name { get; set; }
        public string? Password { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public string BankAccountNumber { get; set; }

        [Phone]
        public string? Phone { get; set; }

        [Required]
        public int RoleID { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? GoogleId { get; set; }  // Lưu Google ID
        public string? Provider { get; set; } // "Google" hoặc "Local"
        public string? GoogleProfilePicture { get; set; }
        public string LocalProfilePicture { get; set; }
        public int Status { get; set; }
        public Gender Gender { get; set; }
        public string? Nickname { get; set; }
    }
}