namespace BusinessObject.DTO
{
    public class ChatDTO
    {
        public int FromAccountId { get; set; }
        public int ToAccountId { get; set; }
        public string Message { get; set; }
    }
}