using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Wallet
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WalletID { get; set; }

        [Required]
        public int AccountID { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "Balance must be at least 0.")]
        public decimal Balance { get; set; }

        [Range(0, double.MaxValue, ErrorMessage = "OnHold currency must be at least 0.")]
        public decimal OnHold { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int Status { get; set; }
        public virtual Account Account { get; set; }
    }
}