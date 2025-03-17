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

        [Phone]
        public string? Phone { get; set; }

        [Required]
        public int RoleID { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? GoogleId { get; set; }  // Lưu Google ID
        public string? Provider { get; set; } // "Google" hoặc "Local"
        public string? ProfilePicture { get; set; } // Ảnh đại diện Google
        public int Status { get; set; }

        public string? Introduction { get; set; } // Cột mới

        [ForeignKey("Gender")]
        public int? GenderID { get; set; }  // Khóa ngoại đến bảng Gender

        public virtual Role Role { get; set; }
        public virtual Wallet Wallet { get; set; }
        public virtual Gender Gender { get; set; } // Navigation Property
    }
}