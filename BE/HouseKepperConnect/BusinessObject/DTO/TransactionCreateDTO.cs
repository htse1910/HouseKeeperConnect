using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class TransactionCreateDTO
    {
        public int TransactionType { get; set; }

        [Required]
        public int WalletID { get; set; }

        [Required]
        public int AccountID { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Amount must be at least 0.")]
        public decimal Amount { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Fee must be at least 0.")]
        public decimal Fee { get; set; }

        public string Description { get; set; }
    }
}