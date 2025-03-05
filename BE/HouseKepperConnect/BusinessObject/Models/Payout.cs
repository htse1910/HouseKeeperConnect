using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Net.NetworkInformation;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class Payout
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Required]
        public int PayoutID { get; set; }
        [Required]
        public int HousekeeperID { get; set; }
        [Required]
        public int WalletID { get; set; }
        public decimal PayoutAmount { get; set; }
        public DateTime PayoutDate { get; set; }
        public int PayoutStatus { get; set; }
        public decimal WalletWithdrawalAmount { get; set; }

        public virtual Housekeeper Housekeeper { get; set; }
        public virtual Wallet Wallet { get; set; }
    }
}
