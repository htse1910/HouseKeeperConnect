namespace BusinessObject.DTO
{
    public class HouseKeeperUpdateDTO
    {
        public int HouseKeeperID { get; set; }

        public int AccountID { get; set; }

        public int HouseKeeperSkillID { get; set; }

        public bool IsVerified { get; set; }
        public string BankAccountNumber { get; set; }

        public byte[] FrontPhoto { get; set; }

        public byte[] BackPhoto { get; set; }

        public byte[] FacePhoto { get; set; }
    }
}