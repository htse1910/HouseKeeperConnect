namespace BusinessObject.DTO
{
    public class SupportRequestDisplayDTO
    {
        public int RequestID { get; set; }
        public int RequestedBy { get; set; }
        public int Type { get; set; }
        public int ReviewedBy { get; set; }
        public string Content { get; set; }
        public string ReviewNote { get; set; }
        public int Status { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string? Picture { get; set; }
    }
}