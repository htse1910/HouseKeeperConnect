namespace BusinessObject.DTO
{
    public class NotificationDisplayDTO
    {
        public int NotificationsID { get; set; }

        public int AccountID { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; } = false;
        public string RedirectUrl { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}