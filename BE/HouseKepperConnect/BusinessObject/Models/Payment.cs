using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace BusinessObject.Models
{
    public class Payment
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int PaymentID { get; set; }
        [ForeignKey("Family")]
        public int FamilyID { get; set; }
        public virtual Family Family { get; set; }

        [ForeignKey("Housekeeper")]
        public int HousekeeperID { get; set; }
        public virtual Housekeeper Housekeeper { get; set; }

        [ForeignKey("PaymentMethod")]
        public int PaymentMethodID { get; set; }
        public virtual PaymentMethod PaymentMethod { get; set; }

        public decimal Amount { get; set; }
        public decimal Commission { get; set; }
        public DateTime PaymentDate { get; set; }
        public string PaymentStatus { get; set; }
        public decimal WalletReduction { get; set; }
        public decimal RemainingAmount { get; set; }
    }
}