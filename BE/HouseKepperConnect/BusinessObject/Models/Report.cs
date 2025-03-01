namespace BusinessObject.Models
{
    public class Report
    {
        public int ReportID { get; set; }
        public int BookingID { get; set; }
        public int AccountID { get; set; }
        public string Reason { get; set; }
        public DateTime CreateAt { get; set; }
        public string ReportStatus { get; set; }

        public virtual Booking Booking { get; set; }
        public virtual Account Account { get; set; }
    }
}