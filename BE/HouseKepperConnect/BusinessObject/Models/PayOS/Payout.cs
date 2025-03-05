using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models.PayOS
{
    public class Payout
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PayoutID { get; set; }

        [ForeignKey("Housekeeper")]
        public int HousekeeperID { get; set; }

        public virtual Housekeeper Housekeeper { get; set; }

        [ForeignKey("Wallet")]
        public int WalletID { get; set; }

        public virtual Wallet Wallet { get; set; }

        [Required]
        public decimal PayoutAmount { get; set; }

        [Required]
        public DateTime PayoutDate { get; set; }

        [Required]
        public bool PayoutStatus { get; set; }

        [Required]
        public decimal WalletWithdrawalAmount { get; set; }
    }
}