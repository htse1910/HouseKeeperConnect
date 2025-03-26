using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Account
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int AccountID { get; set; }

        public string Name { get; set; }
        public string? Password { get; set; }

        [EmailAddress]
        public string Email { get; set; }

        public string Address { get; set; }

        [Phone]
        public string? Phone { get; set; }

        [Required]
        public int RoleID { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? GoogleId { get; set; }  // Lưu Google ID
        public string? Provider { get; set; } // "Google" hoặc "Local"
        public string? GoogleProfilePicture { get; set; } // Ảnh đại diện Google
        public string LocalProfilePicture { get; set; }

        [RegularExpression("^[0-9]*$", ErrorMessage = "Bank number must be numeric.")]
        public string? BankAccountNumber { get; set; }

        public int Status { get; set; }

        public string? Introduction { get; set; }
        public int? Gender { get; set; }
        public string? Nickname { get; set; }

        public virtual Role Role { get; set; }
        public virtual Wallet Wallet { get; set; }
        public virtual IEnumerable<Notification> Notification { get; set; }
    }
}