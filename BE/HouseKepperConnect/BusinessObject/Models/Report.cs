namespace BusinessObject.Models
{
    public class Report
    {
        public int ReportID { get; set; }

        public int BookingID { get; set; }

        public int AccountID { get; set; }
        public string Reason { get; set; }
        public DateTime CreateAt { get; set; }
        public int ReportStatus { get; set; }

        public int? ReviewByID { get; set; }
        public DateTime? ReviewedAt { get; set; } 

        public string? StaffResponse { get; set; }
        public virtual Account? ReviewBy { get; set; }
        public virtual Booking Booking { get; set; }
        public virtual Account Account { get; set; }
    }
}