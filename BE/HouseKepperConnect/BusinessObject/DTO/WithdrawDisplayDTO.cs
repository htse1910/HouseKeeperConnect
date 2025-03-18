using System.ComponentModel.DataAnnotations;

namespace BusinessObject.DTO
{
    public class WithdrawDisplayDTO
    {
        public int WithdrawID { get; set; }

        [Required]
        public int AccountID { get; set; }

        [Required]
        [RegularExpression("^[0-9]*$", ErrorMessage = "Bank number must be numeric.")]
        public string BankNumber { get; set; }

        public decimal Amount { get; set; }
        public DateTime RequestDate { get; set; }
        public int Status { get; set; }
    }
}