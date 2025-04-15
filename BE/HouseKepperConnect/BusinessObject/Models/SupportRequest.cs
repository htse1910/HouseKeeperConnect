using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class SupportRequest
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int RequestID { get; set; }

        [ForeignKey("Requester")]
        public int RequestedBy { get; set; }

        public int Type { get; set; }

        [ForeignKey("Reviewer")]
        public int? ReviewedBy { get; set; }

        public string Content { get; set; }
        public string? ReviewNote { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public DateTime UpdatedDate { get; set; } = DateTime.Now;
        public string? Picture { get; set; }

        public virtual Account Requester { get; set; }
        public virtual Account Reviewer { get; set; }
    }
}