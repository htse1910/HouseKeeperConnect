using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("PaymentMethod")]
public class PaymentMethod
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int PaymentMethodID { get; set; }

    [Required]
    [StringLength(100)]
    public string PaymentName { get; set; }

    [StringLength(255)]
    public string PaymentDetail { get; set; }
}