namespace BusinessObject.Models.JWTToken
{
    public class TokenModel
    {
        public Guid AccountID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public int RoleID { get; set; }
    }
}