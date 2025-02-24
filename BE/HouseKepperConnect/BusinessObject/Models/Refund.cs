using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessObject.Models
{
    public class Refund
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RefundID { get; set; }

        [ForeignKey("Payment")]
        public int PaymentID { get; set; }

        [Required]
        public decimal RefundAmount { get; set; }

        [Required]
        [MaxLength(500)]
        public string RefundReason { get; set; }

        [Required]
        [MaxLength(50)]
        public string RefundStatus { get; set; }

        [Required]
        public bool IsWalletRefund { get; set; }

        public decimal? RefundToWalletAmount { get; set; }

        public virtual Payment Payment { get; set; }
    }
}
