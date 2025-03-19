namespace BusinessObject.DTO
{
    public class ReportDisplayDTO
    {
        public int ReportID { get; set; }
        public int BookingID { get; set; }
        public int AccountID { get; set; }
        public string Reason { get; set; }
        public DateTime CreateAt { get; set; }
        public string ReportStatus { get; set; }
    }
}