namespace BusinessObject.Models.JWTToken
{
    public class JWTLoginModel
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
}