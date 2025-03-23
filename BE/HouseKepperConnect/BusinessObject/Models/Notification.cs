using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BusinessObject.Models
{
    public class Notification
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int NotificationsID { get; set; }

        public int AccountID { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; } = false;
        public string? RedirectUrl { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public virtual Account Account { get; set; }
    }
}