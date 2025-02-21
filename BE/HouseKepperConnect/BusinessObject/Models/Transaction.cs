using System.ComponentModel.DataAnnotations;

namespace BusinessObject.Models
{
    public class Transaction
    {
        [Key]
        public int TransactionID { get; set; }

        [Required]
        public int TransactionType { get; set; }

        [Required]
        public int WalletID { get; set; }

        [Required]
        public int AccountID { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Original Price must be at least 0.")]
        public decimal Amount { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Original Fee must be at least 0.")]
        public decimal Fee { get; set; }

        public string Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int Status { get; set; }

        public virtual Wallet Wallet { get; set; }
        public virtual Account Account { get; set; }
    }
}