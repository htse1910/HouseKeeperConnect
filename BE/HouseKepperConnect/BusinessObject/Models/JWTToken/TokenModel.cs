namespace BusinessObject.Models.JWTToken
{
    public class TokenModel
    {
        public int AccountID { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public int RoleID { get; set; }
        public string RoleName { get; set; }
    }
}