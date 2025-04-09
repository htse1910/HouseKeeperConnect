namespace BusinessObject.DTO
{
    public class PayoutDisplayDTO
    {
        public int PayoutID { get; set; }
        public int FamilyID { get; set; }
        public string Nickname { get; set; }
        public string Avatar { get; set; }
        public int JobID { get; set; }
        public string JobName { get; set; }
        public List<int> services { get; set; }
        public decimal Amount { get; set; }
        public DateTime PayoutDate { get; set; }
        public int Status { get; set; }
    }
}