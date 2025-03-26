namespace BusinessObject.DTO
{
    public class ReportUpdateDTO
    {
        public int ReportID { get; set; }
        public int ReportStatus { get; set; }
        public int? ReviewByID { get; set; }
        public string? StaffResponse { get; set; }
    }
}