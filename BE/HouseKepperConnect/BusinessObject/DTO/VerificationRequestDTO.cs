namespace BusinessObject.DTO
{
    public class VerificationRequestDTO
    {
        public int AccountID { get; set; }
        public int? IDNumber { get; set; }
        public string? RealName { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string Notes { get; set; }
    }
}