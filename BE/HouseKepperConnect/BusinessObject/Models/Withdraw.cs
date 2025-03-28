using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Withdraw
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int WithdrawID { get; set; }

        [Required]
        public int AccountID { get; set; }

        [Required]
        [RegularExpression("^[0-9]*$", ErrorMessage = "Bank number must be numeric.")]
        public string BankNumber { get; set; }

        public decimal Amount { get; set; }
        public DateTime RequestDate { get; set; }
        public int Status { get; set; }
        public int TransactionID { get; set; }

        public virtual Account Account { get; set; }
        public virtual Transaction Transaction { get; set; }
    }
}